import { Component, ViewChild } from '@angular/core';
import { NavController, LoadingController, Events, Slides } from 'ionic-angular';
import { AppConfig } from '../../common/appConfig';
import { UISvr } from '../../services/uiSvr';
import { SvrSettingPage } from './svrSetting/svrSetting';
import { AppCfgSvr } from '../../services/appCfgSvr';
import { PatternPage } from './pattern/pattern';

@Component({
  selector: 'page-logon',
  templateUrl: 'logon.html',
})
export class LogonPage {

  appCfg: AppConfig;
  model: LogonModel;
  LogonedUsr: Array<any>;
  @ViewChild(Slides) slides: Slides;


  constructor(private navCtrl: NavController,
    private uiSvr: UISvr,
    private appcfgSvr: AppCfgSvr,
    private loadingCtrl: LoadingController,
    private events: Events
  ) {
    this.LogonedUsr = [];
    this.model = new LogonModel();
    this.appCfg = AppConfig.getInstance();
    this.model.ImgPath = './assets/imgs/user.png';
    //TODO:测试使用
    this.model.LoginName = 'admin';
    this.model.Password = '1';
  }

  ionViewWillEnter() {
    this.getSvrUrl();
    this.getLogonedUser();
  }

  /**获取服务器配置地址 */
  getSvrUrl() {
    this.appcfgSvr.getSvrUrl().then((res) => {
      if (res) {
        this.appCfg.setHMSServiceUrl(res.SvrUrl);
      }
    });
  }

  /**获取已登录过用户记录 */
  getLogonedUser() {
    this.appcfgSvr.getLogonUserList().then((res) => {
      this.LogonedUsr = res;
    });
  }


  login() {
    if (!this.appCfg.HMSServiceUrl) {
      this.uiSvr.alert("请先配置服务器地址");
      return;
    }
    let loader = this.loadingCtrl.create({
      content: "登录中...",
      duration: 1000
    });
    loader.present();
    this.appcfgSvr.login(this.model.LoginName, this.model.Password).then((res) => {
      this.setLoginCfg(res.UserId, res.UserName);
      loader.dismiss().then(() => {
        this.navCtrl.popToRoot();
      })
    }, (err) => {
      loader.dismiss().then(() => {
        this.uiSvr.alert("登录失败", "参考消息: " + err);
      })
    });

  }

  /**保存当前登录用户信息 */
  private setLoginCfg(userid, username) {
    this.appCfg.setUserId(userid);
    this.appCfg.setUserName(username);
    this.events.publish('init/userId', userid);
  }

  /**
   * 身份验证切换
   */
  onVerifyChange() {
    if (!this.appCfg.HMSServiceUrl) {
      this.uiSvr.alert("请先配置服务器地址");
      return;
    }

    this.appcfgSvr.checkInternet().then((res) => {
      if (this.model.LoginName) {
        this.appcfgSvr.getByLoginName(this.model.LoginName).then((res) => {
          if (res.length == 1 && res[0].PatternPwd && res[0].PatternPwd != "") {
            this.navCtrl.push(PatternPage, { UserId: res[0].UserId, UserName: res[0].UserName, patternPwd: res[0].PatternPwd });
            this.events.subscribe('login/pattern', (pass) => {
              if (pass) {
                this.setLoginCfg(res[0].UserId, res[0].UserName);
              }
            })
          } else {
            this.uiSvr.alert("当前用户尚未设置手势密码");
            return;
          }
        });

      }
      else {
        this.uiSvr.alert('请输入用户名信息')
      }
    }, (err) => {
      this.uiSvr.alert(err);
      return;
    });
  }

  slideChanged() {
    let idx = this.slides.getActiveIndex();
    if (idx <= this.slides.length() - 1) {
      let item = this.LogonedUsr[idx];
      this.model.LoginName = item.LoginName;
      this.model.Password = "";
    }
  }

  svrSetting() {
    this.navCtrl.push(SvrSettingPage, { url: this.appCfg.HMSServiceUrl });
  }

}

/**
 * Logon Model
 */
class LogonModel {
  LoginName: string;
  Password: string;
  ImgPath: string;
}
