import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { ResumePage } from './resume';

@NgModule({
    declarations: [
        ResumePage
    ],
    imports: [
        IonicModule.forRoot(ResumePage)
    ]
})
export class ResumeModule {

}