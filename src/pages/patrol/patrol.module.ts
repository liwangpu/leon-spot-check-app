import { NgModule } from '@angular/core';
import { PatrolPage } from './patrol';
import { MachListPage } from './machList/machList';
import { PlanPage } from './plan/plan';
import { IonicModule } from 'ionic-angular';
import { DownPage } from './down/down';
import { ComfirmDownPage } from './down/confirm';
import { PointListPage } from './pointList/pointList';
import { InputNumPage } from './pointList/inputNumber';
import { InputObsPage } from './pointList/inputObs';
import { StatPage } from './stat/stat';
import { StatusPage } from './status/status';

@NgModule({
    declarations: [
        PatrolPage,
        MachListPage,
        PlanPage,
        DownPage,
        ComfirmDownPage,
        PointListPage,
        InputNumPage,
        InputObsPage,
        StatPage,
        StatusPage
    ],
    entryComponents: [
        PatrolPage,
        MachListPage,
        PlanPage,
        DownPage,
        ComfirmDownPage,
        PointListPage,
        InputNumPage,
        InputObsPage,
        StatPage,
        StatusPage
    ],
    imports: [
        IonicModule
    ],
    exports: [IonicModule]
})
export class PatrolModule {

}