import { Component } from '@angular/core';
import { NavParams, NavController, Nav } from 'ionic-angular';
import { AppConfig } from '../../../common/appConfig';
import { PatrolAsyncService } from '../../../services/patrolSvr/patrolAsync';
import { UISvr } from '../../../services/uiSvr';
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
    constructor(private navCtrl: NavController,
        private navPara: NavParams,
        private patrolAsnc: PatrolAsyncService,
        private uiSvr: UISvr,
        private nav: Nav) {
        this.execTime = 3;
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
            allSuccessMessage: '数据加载中...',
            allSucceedCallback: () => {
                let tabIdx = this.nav.getActiveChildNavs()[0].getSelected().index;
                if (tabIdx == 1)
                    this.navCtrl.remove(2, this.navCtrl.length() - 2);
                else
                    this.navCtrl.goToRoot(null);
            }
        });
    }

}