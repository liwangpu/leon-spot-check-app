import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { AppSuiteModule } from '../../suites/suite.module';
import { AdvsPage } from './advs';

@NgModule({
    imports: [
        IonicModule
        , AppSuiteModule
    ],
    declarations: [
        AdvsPage
    ],
    entryComponents: [
        AdvsPage
    ],
    exports: [IonicModule]
})
export class AdvsModule {

}