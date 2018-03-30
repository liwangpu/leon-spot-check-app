import { Component, ViewChild, NgZone } from '@angular/core';
import { CommonHelper } from '../../../common/commonHelper';
import { NavController, NavParams } from 'ionic-angular';
import { UISvr } from '../../../services/uiSvr';
import { devinfo } from '../../../common/constants';
import { PatrolAsyncService } from '../../../services/patrolSvr/patrolAsync';
import { ComfirmDownPage } from './confirm';
import { AppConfig } from '../../../common/appConfig';
import { Content, Header } from 'ionic-angular';
@Component({
    selector: 'page-patrol-down',
    templateUrl: './down.html'
})
export class DownPage {
    planList: Array<any>;
    commonHelper: CommonHelper;
    selectedPlan: object;
    checkAllText: string;
    @ViewChild(Content) content: Content;
    @ViewChild(Header) header: Header;
    isScolled: boolean = false;
    dividerStyle: {};
    selectAll: boolean = false;
    hasDownList: Array<any> = [];

    constructor(private navCtrl: NavController,
        private patrolAsync: PatrolAsyncService,
        private uiSvr: UISvr,
        private zone: NgZone,
        private paras: NavParams
    ) {
        this.planList = [];
        this.selectedPlan = {};
        this.commonHelper = CommonHelper.getInstance();
        this.checkAllText = "全选";
        this.hasDownList = this.paras.get('planList');
    }

    ngOnInit() {
        this.getPlanList();
    }

    scrollHandler(event) {
        this.dividerStyle = {
            'margin-top': this.header.getNativeElement().clientHeight.toString() + 'px',
            'position': 'absolute'
        }
        this.zone.run(() => {
            if (this.content.getContentDimensions().scrollTop > 0) {
                this.isScolled = true;
            } else {
                this.isScolled = false;
            }
        });
    }

    doRefresh(refresher) {
        this.isScolled = false;
        this.checkAllText = "全选";
        this.selectAll = false;
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
        this.selectAll = isCheck;
        if (isCheck) {
            this.planList.forEach(item => {
                item.checked = true;
                this.onCheck(item.PatrolPlanId, true);
            });
        } else {
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
        let userId = AppConfig.getInstance().UserId, devId = devinfo;

        let trans = (datas) => {
            let transDatas = [];
            for (let item of datas) {
                let downCol = this.hasDownList.filter(p => {
                    return p.PlanId == item.PatrolPlanId;
                });
                let changeCol = this.hasDownList.filter(p => {
                    return p.PlanId == item.PatrolPlanId && p.PlanVersion < item.PlanVer;
                });
                let obj = {
                    FirstExecTime: this.commonHelper.toDatetime(item.FirstExecTime),
                    PeriodUnitName: this.commonHelper.getPeriodName(item.PeriodUnit),
                    IsDownload: downCol.length == 1 ? '已下载' : '',
                    hasChanged: changeCol.length == 1 ? '有变更' : ''
                };
                if (item.PointCount > 0)
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