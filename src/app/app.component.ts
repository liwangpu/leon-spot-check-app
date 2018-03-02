import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Events, Keyboard, IonicApp } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AppConfig } from '../common/appConfig';
import { AppMinimize } from '@ionic-native/app-minimize';
import { TabsPage } from '../pages/tabs/tabs';
import { DataBase } from '../services/services';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = TabsPage;
  userName: string;

  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public events: Events,
    private appMinimize: AppMinimize,
    private keyboard: Keyboard,
    private ionicApp: IonicApp,
    private dbSvr: DataBase
  ) {
    this.initializeApp();

  }

  initializeApp() {
    let isMobile = this.platform.is('mobile');//是否为移动设备
    AppConfig.getInstance().setIsMobile(isMobile);
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      //移动设备环境下,先打开数据库
      if (isMobile) {
        this.dbSvr.openDB(null, isMobile).then((res) => {
          let sql = 'CREATE TABLE IF NOT EXISTS T_AppCfg ( AppCfgId integer primary key ,CfgValue text NOT NULL ,CfgKey text ,UserId integer  NOT NULL, UserName text NOT NULL, LoginName text NOT NULl, ImgPath text, PatternPwd text, CTime text  ) ';
          let svrSql = ' CREATE TABLE IF NOT EXISTS T_SvrCfg(SvrCfgId integer primary key, SvrUrl text NOT NULL, CTime text)';
          this.dbSvr.nestedExecute(this.dbSvr.Ins, sql, svrSql, [], []);
        });
      }
      //注册返回按钮事件
      this.registerBackButtonAction();
    });
  }

  ionViewDidLoad() {
    this.userName = AppConfig.getInstance().UserName;
  }

  ionViewWillEnter() {

  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  // 修改android返回按钮事件,使app最小化,而不是退出,API仅支持android系统
  registerBackButtonAction() {
    if (!this.platform.is('android')) {
      return;
    }

    this.platform.registerBackButtonAction(() => {
      this.events.publish('android:backButtonAction');
      if (this.keyboard.isOpen()) {//如果键盘开启则隐藏键盘
        this.keyboard.close();
        return;
      }

      //如果想点击返回按钮隐藏toast或loading或Overlay就把下面加上
      // this.ionicApp._toastPortal.getActive() ||this.ionicApp._loadingPortal.getActive()|| this.ionicApp._overlayPortal.getActive()
      let activePortal = this.ionicApp._modalPortal.getActive() || this.ionicApp._toastPortal.getActive() || this.ionicApp._overlayPortal.getActive();
      if (activePortal) {
        activePortal.dismiss();
        return;
      }
      let tabs = this.nav.getActiveChildNav();//获取tabs导航,this.nav是总导航,tabs是子导航
      let tab = tabs.getSelected();//获取选中的tab
      let activeVC = tab.getActive();//通过当前选中的tab获取ViewController
      let activeNav = activeVC.getNav();//通过当前视图的ViewController获取的NavController
      return activeNav.canGoBack() ? activeNav.pop() : this.appMinimize.minimize();//this.showExit()

    }, 1);
  }
}
