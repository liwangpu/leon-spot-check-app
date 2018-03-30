import { Component, ViewChild, ElementRef, Renderer } from '@angular/core';
import { NavController, LoadingController, Events, Slides, Content } from 'ionic-angular';
import { AppConfig } from '../../common/appConfig';
import { UISvr } from '../../services/uiSvr';
import { SvrSettingPage } from './svrSetting/svrSetting';
import { AppCfgSvr } from '../../services/appCfgSvr';
import { PatternPage } from './pattern/pattern';
import { Keyboard } from '@ionic-native/keyboard';

@Component({
  selector: 'page-logon',
  templateUrl: 'logon.html',
})
export class LogonPage {

  appCfg: AppConfig;
  model: LogonModel;
  LogonedUsr: Array<any>;
  @ViewChild(Slides) slides: Slides;
  @ViewChild("username") inputName;
  @ViewChild('myFooter') myFooter: ElementRef;
  @ViewChild(Content) content: Content;
  mb: any;//content与底部间距

  containUsr: boolean = true;
  curUrl: string;

  constructor(private navCtrl: NavController,
    private uiSvr: UISvr,
    private appcfgSvr: AppCfgSvr,
    private loadingCtrl: LoadingController,
    private events: Events,
    private keyboard: Keyboard,
    private renderer: Renderer
  ) {
    this.LogonedUsr = [];
    this.model = new LogonModel();
    this.appCfg = AppConfig.getInstance();
    this.model.ImgPath = './assets/imgs/user_white.png';
    //TODO:测试使用
    // this.model.LoginName = 'admin';
    // this.model.Password = '1';
  }

  ionViewWillEnter() {
    this.getSvrUrl();
    this.getLogonedUser();
  }

  ionViewDidEnter() {
    if (!this.model.LoginName) {
      setTimeout(() => {
        this.inputName.setFocus();
        this.keyboard.show();
      }, 800);
    }
    //显示键盘的时候隐藏foot
    this.keyboard.onKeyboardShow().subscribe(() => { this.adjustFooter(true); });
    this.keyboard.onKeyboardHide().subscribe(() => { this.adjustFooter(false); });
  }

  //弹出/隐藏键盘时,重新调整footer
  adjustFooter(isHidden) {
    let content = this.queryElement(<HTMLElement>this.content.getElementRef().nativeElement, '.scroll-content')
    if (isHidden) {
      this.renderer.setElementStyle(this.myFooter.nativeElement, 'display', 'none');
      this.mb = content.style['margin-bottom'];
      this.renderer.setElementStyle(content, 'margin-bottom', '0');
    } else {
      this.renderer.setElementStyle(this.myFooter.nativeElement, 'display', '');
      this.renderer.setElementStyle(content, 'margin-bottom', this.mb);
    }
  }

  private queryElement(elem: HTMLElement, q: string): HTMLElement {
    return <HTMLElement>elem.querySelector(q);
  }

  /**获取服务器配置地址 */
  getSvrUrl() {
    this.appcfgSvr.getSvrUrl().then((res) => {
      if (res) {
        this.appCfg.setHMSServiceUrl(res.SvrUrl);
        this.curUrl = res.SvrUrl;
      }
    });
  }

  /**获取已登录过用户记录 */
  getLogonedUser() {
    this.appcfgSvr.getLogonUserList().then((res) => {
      this.LogonedUsr = res;
      if (res.length > 0)
        this.model.LoginName = res[0].LoginName;
    });
  }

  login() {
    if (!this.model.LoginName || !this.model.Password) {
      return;
    }
    if (!this.appCfg.HMSServiceUrl) {
      this.uiSvr.alert("请先配置服务器地址");
      return;
    }
    this.keyboard.close();
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

  changeUsr() {
    let curUsr = this.LogonedUsr.filter((x) => {
      return x.LoginName == this.model.LoginName;
    });
    if (curUsr.length == 0) {
      this.containUsr = false;
    } else {
      this.containUsr = true;
    }
  }

  slideToPre() {
    this.slides.slidePrev();
  }

  slideToNext() {
    this.slides.slideNext();
  }

  svrSetting() {
    if (this.navCtrl.getAllChildNavs().indexOf(SvrSettingPage) == -1) {
      this.navCtrl.push(SvrSettingPage, { url: this.appCfg.HMSServiceUrl });
    }
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
