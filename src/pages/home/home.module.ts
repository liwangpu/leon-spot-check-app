import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { HomePage } from './home';
import { StatAreaPage } from './statArea/statArea';
import { StatusReportAdv } from './statArea/report/statusReport';
import { StatusAreaPage } from './statusArea/statusArea';
import { ArrivalRateAdv } from './statArea/arrival/arrivalRate';
import { ModuleAreaPage } from './moduleArea/moduleArea';
import { AppSuiteModule } from '../../suites/suite.module';
import { EditModAreaPage } from './editModArea/editModArea';
@NgModule({
    imports: [
        IonicModule
        , AppSuiteModule
    ],
    declarations: [
        HomePage
        , StatAreaPage
        , StatusAreaPage
        , ModuleAreaPage
        , StatusReportAdv
        , ArrivalRateAdv
        , EditModAreaPage
    ],
    entryComponents: [
        HomePage
        , StatAreaPage
        , StatusAreaPage
        , ModuleAreaPage
        , StatusReportAdv
        , ArrivalRateAdv
        , EditModAreaPage
    ],
    exports: [IonicModule]
})
export class HomeModule {

}