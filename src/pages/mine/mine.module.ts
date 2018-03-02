import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { MinePage } from './mine';
import { AboutPage } from './about/about';
import { SyssetPage } from './sysset/sysset';
import { UserSetPage } from './userSetting/userSetting';
import { SetPatternPage } from './setPattern/setPattern';

@NgModule({
    imports: [IonicModule],
    declarations: [MinePage, AboutPage, SyssetPage, UserSetPage, SetPatternPage],
    entryComponents: [MinePage, AboutPage, SyssetPage, UserSetPage, SetPatternPage],
    exports: [IonicModule]
})
export class MineModule {
}