import { Component, OnInit } from '@angular/core';
import { CommonHelper } from '../../../common/commonHelper';
import { NavController } from 'ionic-angular';
import { UISvr } from '../../../services/uiSvr';
import { devinfo } from '../../../common/constants';
import { PatrolAsyncService } from '../../../services/patrolSvr/patrolAsync';
import { ComfirmDownPage } from './confirm';
@Component({
    selector: 'page-patrol-down',
    templateUrl: './down.html',
    providers: [PatrolAsyncService]
})
export class DownPage implements OnInit {
    planList: Array<any>;
    commonHelper: CommonHelper;
    selectedPlan: object;
    checkAllText: string;
    constructor(private navCtrl: NavController,
        private patrolAsync: PatrolAsyncService,
        private uiSvr: UISvr) {
        this.planList = [];
        this.selectedPlan = {};
        this.commonHelper = CommonHelper.getInstance();

        this.checkAllText = "全选";
    }

    ngOnInit() {
        this.getPlanList();
    }

    doRefresh(refresher) {
        this.getPlanList().then(() => {
            refresher.complete();
        }).catch(() => {
            refresher.complete();
        });
    }

    onNextStep() {
        let keys = Object.keys(this.selectedPlan);
        let checked = keys.filter(key => this.selectedPlan[key]);
        if (checked.length === 0) {
            this.uiSvr.simpleTip('请选择需要下载的计划!');
            return;
        }

        let planNames = [];
        for (let id of checked) {
            for (let item of this.planList) {
                if (item['PatrolPlanId'] === Number(id))
                    planNames.push(item['PlanName']);
            }
        }
        this.navCtrl.push(ComfirmDownPage, { planIds: checked, planNames: planNames });
    }

    onCheck(planId, isCheck) {
        let obj = {};
        obj[planId] = isCheck;
        Object.assign(this.selectedPlan, obj);
    }

    changeAllCheck(isCheck) {
        this.checkAllText = isCheck ? "取消全选" : "全选";
        if (isCheck) {
            this.planList.forEach(item => {
                item.checked = true;
                this.onCheck(item.PatrolPlanId, true);
             });
        }else{
            this.planList.forEach(item => {
                item.checked = false;
                this.onCheck(item.PatrolPlanId, false);
             });
        }
    }

    /**
     * 获取可以下载的计划
     */
    getPlanList(): Promise<any> {
        let userId = 1, devId = devinfo;

        let trans = (datas) => {
            let transDatas = [];
            for (let item of datas) {
                let obj = {
                    FirstExecTime: this.commonHelper.toDatetime(item.FirstExecTime),
                    PeriodUnitName: this.commonHelper.getPeriodName(item.PeriodUnit)
                };
                transDatas.push(Object.assign(item, obj));
            }
            return transDatas;
        }
        return this.patrolAsync.GetPatrolPlan(userId, devId).map(va => trans(va)).toPromise().then((rdata) => {
            this.planList = rdata;
            return Promise.resolve();
        });
    }
}