import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { LogonPage } from './logon';
import { PatternPage } from './pattern/pattern';
import { SvrSettingPage } from './svrSetting/svrSetting';

@NgModule({
    imports: [IonicModule,
    ],
    declarations: [LogonPage, PatternPage, SvrSettingPage],
    entryComponents: [LogonPage, PatternPage, SvrSettingPage],
    exports: [IonicModule]
})
export class LogonModule {
}