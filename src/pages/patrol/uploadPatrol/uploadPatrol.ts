import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { PatrolAsyncService } from '../../../services/patrolSvr/patrolAsync';
import { PatrolSvr, HistorySvr } from '../../../services/services';
import { CommonHelper } from '../../../common/commonHelper';
import { AppConfig } from '../../../common/appConfig';
import { UISvr } from '../../../services/uiSvr';
import { devinfo } from '../../../common/constants';

@Component({
    selector: 'page-UploadPatrol',
    templateUrl: './uploadPatrol.html'
})
export class UploadPatrolPage {

    commonHelper: CommonHelper;
    PlanListUnUpload: Array<any>;
    selectedPlan: Array<Number>;
    stat: any;

    constructor(
        private navParas: NavParams,
        private uiSvr: UISvr,
        private patrolAsync: PatrolAsyncService,
        private patrolSvr: PatrolSvr,
        private historySvr: HistorySvr
    ) {
        this.PlanListUnUpload = [];
        this.selectedPlan = [];
        this.commonHelper = CommonHelper.getInstance();
        this.stat = this.navParas.get('Stat');
    }

    ionViewDidEnter() {
        this.PlanListUnUpload = [];
        this.selectedPlan = [];
        this.getUnUploadPlan();
    }

    /**获取待回收计划数据 */
    private getUnUploadPlan() {
        this.patrolSvr.getUnUploadPlan(AppConfig.getInstance().UserId).then((pList) => {
            this.PlanListUnUpload = pList;
        })
    }

    /**选择计划 */
    onCheck(patrolId, isCheck) {
        if (isCheck) {
            this.selectedPlan.push(patrolId);
        } else {
            this.selectedPlan.splice(this.selectedPlan.indexOf(patrolId), 1);
        }
    }

    /**全选 */
    changeAllCheck(isChecked) {
        if (isChecked) {
            this.PlanListUnUpload.forEach(item => {
                item.checked = true;
                this.onCheck(item.LocalPatrolId, true);
            });
        } else {
            this.PlanListUnUpload.forEach(item => {
                item.checked = false;
                this.onCheck(item.LocalPatrolId, false);
            });
        }
    }

    /**回收计划 */
    doUpload() {
        if (this.selectedPlan.length === 0) {
            this.uiSvr.simpleTip('请选择需要回收的计划!');
            return;
        }
        let defer = () => {
            return this.patrolAsync.uploadPatrolDataById('', AppConfig.getInstance().UserId, devinfo, this.selectedPlan).toPromise();
        };
        this.uiSvr.loading(defer(), "数据上传中", () => {
            this.getUnUploadPlan();
        });
    }

    /**删除待回收计划 */
    deleteLocalPatrolData(item) {
        this.historySvr.getWaitReceiveCnt(AppConfig.getInstance().UserId, item.LocalPatrolId).then((cres) => {
            if (cres > 0) {
                this.uiSvr.confirm('', '当前巡检数据未回收，是否继续删除?', () => {
                    this.patrolSvr.deleteLocalPatrolDataById(item.LocalPatrolId, AppConfig.getInstance().UserId).then((res) => {
                        this.uiSvr.showLoading("删除成功!", 800);
                        //刷新计划列表和巡检数据统计
                        this.ionViewDidEnter();
                    }, (err) => {
                        this.uiSvr.alert('巡检数据删除失败', item.PlanName + ' 删除失败！参考信息：' + err);
                    });
                })
            } else {
                this.patrolSvr.deleteLocalPatrolDataById(item.LocalPatrolId, AppConfig.getInstance().UserId).then((res) => {
                    this.uiSvr.showLoading("删除成功!", 800);
                    //刷新计划列表和巡检数据统计
                    this.ionViewDidEnter();
                }, (err) => {
                    this.uiSvr.alert('巡检数据删除失败', item.PlanName + ' 删除失败！参考信息：' + err);
                });
            }
        }, (err)=>{
            this.uiSvr.alert('巡检数据删除失败', item.PlanName + ' 删除失败！参考信息：' + err);
        });

    }
}