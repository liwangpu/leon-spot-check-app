import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpClientModule } from '@angular/common/http';
import { LoggerSvr } from '../services/loggerSvr';
import { AlarmSvr } from '../services/alarmSvr/alarmSvr';
import { SQLite } from '@ionic-native/sqlite'
import { DataBase, HistorySvr, PatrolSvr } from '../services/services';
import { AppCfgSvr } from '../services/appCfgSvr';
import { UISvr } from '../services/uiSvr';
import { PatrolModule } from '../pages/patrol/patrol.module';
import { ResumeModule } from '../pages/resume/resume.module';
import { StatusModule } from '../pages/status/status.module';
import { WorkBookModule } from '../pages/workbook/workbook.module';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { HomeModule } from '../pages/home/home.module';
import { AdvsModule } from '../pages/advs/advs.module';
import { MineModule } from '../pages/mine/mine.module';
import { TabsPage } from '../pages/tabs/tabs';
import { MessagePage } from '../pages/message/message';
import { AppSuiteModule } from '../suites/suite.module';
import { HttpModule } from '@angular/http';
import { HttpService } from '../services/httpService';
import { LogonModule } from '../pages/logon/logon.module';
import { MachTreeAsyncService } from '../services/machTreeSvr/machTreeAsync';
import { Camera } from "@ionic-native/camera";
import { NativeService } from '../services/nativeService';

import { AppVersion } from '@ionic-native/app-version';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { Keyboard } from '@ionic-native/keyboard';

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    MessagePage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: '返回',
      mode: 'ios',
      tabsHideOnSubPages: true
    }),
    HttpModule,
    AppSuiteModule,
    PatrolModule,
    CommonModule,
    ResumeModule,
    StatusModule,
    WorkBookModule,
    HomeModule,
    AdvsModule,
    MineModule,
    LogonModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    MessagePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    HttpService,
    SQLite,
    DataBase,
    LoggerSvr,
    HistorySvr,
    PatrolSvr,
    AppCfgSvr,
    AlarmSvr,
    UISvr,
    MachTreeAsyncService,
    BarcodeScanner,
    Camera,
    NativeService,
    AppVersion,
    FileTransfer,
    File,
    FileOpener,
    Keyboard
  ]
})
export class AppModule { }
