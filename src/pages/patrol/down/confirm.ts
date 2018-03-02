import { Component } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';
import { AppConfig } from '../../../common/appConfig';
import { PatrolAsyncService } from '../../../services/patrolSvr/patrolAsync';
import { UISvr } from '../../../services/uiSvr';
import { PlanPage } from '../plan/plan';
import { HomePage } from '../../home/home';
@Component({
    selector: 'page-patrol-down-confirm',
    templateUrl: './confirm.html',
    providers: [PatrolAsyncService]
})
export class ComfirmDownPage {
    userName: string;
    execTime: number;
    planIds: Array<string>;
    planNames: Array<string>;
    constructor(private navCtrl: NavController, private navPara: NavParams, private patrolAsnc: PatrolAsyncService, private uiSvr: UISvr) {
        this.execTime = 10;
        this.planIds = this.navPara.get('planIds');
        this.planNames = this.navPara.get('planNames');
    }

    ionViewDidEnter() {
        this.userName = AppConfig.getInstance().UserName;
    }

    onDownLoad() {
        let strDev = 'PMSHUB';
        let userId = AppConfig.getInstance().UserId;
        let allPromiseFuns = [];
        let allPromiseMessage = [];
        for (let planId of this.planIds) {
            let fun = () => {
                return this.patrolAsnc.getPatrolPlanData(userId, strDev, planId, this.execTime).toPromise();
            }
            allPromiseFuns.push(fun);
        }

        for (let k = 0, len = this.planNames.length; k < len; k++) {
            let msg = `共需下载${len}条计划,正在下载第${k + 1}条计划:${this.planNames[k]}`;
            allPromiseMessage.push(msg);
        }

        this.uiSvr.seriesLoading({
            promiseFunction: allPromiseFuns,
            promiseMessage: allPromiseMessage,
            ignoreReject: true,
            allSuccessMessage: '计划下载完毕',
            allSucceedCallback: () => {
                this.navCtrl.setRoot(HomePage).then(() => { this.navCtrl.push(PlanPage) });
            }
        });
    }

}