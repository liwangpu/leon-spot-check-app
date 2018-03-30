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
import { UploadPatrolPage } from './uploadPatrol/uploadPatrol';
import { PatrolAsyncService } from '../../services/patrolSvr/patrolAsync';

@NgModule({
    declarations: [
        PlanPage,
        PatrolPage,
        MachListPage,
        DownPage,
        ComfirmDownPage,
        PointListPage,
        InputNumPage,
        InputObsPage,
        StatPage,
        StatusPage,
        UploadPatrolPage
    ],
    entryComponents: [
        PlanPage,
        PatrolPage,
        MachListPage,
        DownPage,
        ComfirmDownPage,
        PointListPage,
        InputNumPage,
        InputObsPage,
        StatPage,
        StatusPage,
        UploadPatrolPage
    ],
    imports: [
        IonicModule
    ],
    exports: [IonicModule],
    providers: [PatrolAsyncService]
})
export class PatrolModule {

}