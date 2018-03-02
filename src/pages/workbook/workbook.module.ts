import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { WorkBookPage } from './workbook';

@NgModule({
    declarations: [
        WorkBookPage
    ],
    imports: [
        IonicModule.forRoot(WorkBookPage)
    ]
})
export class WorkBookModule {

}