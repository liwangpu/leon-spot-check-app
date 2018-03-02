import { Component } from '@angular/core';
import { NavParams, ViewController, Events } from 'ionic-angular';
import { PatrolSvr } from '../../../services/services';
import { LoggerSvr } from '../../../services/loggerSvr';
import { AppConfig } from '../../../common/appConfig';
import { CommonHelper } from '../../../common/commonHelper';
import { UISvr } from '../../../services/uiSvr';

@Component({
    templateUrl: 'inputObs.html'
})
export class InputObsPage {
    curPatrol: any;
    curMach: any;
    curPoint: any;
    PointCnt = 0;
    MeasNode: any;
    MeasLocation: any;
    curUser: {
        UserId: number;
        UserName: string
    };
    helper = CommonHelper.getInstance();
    PtObs: Array<any>;
    PointHistory: Array<any>;
    Des: any;//备注
    seletedObs = [];
    obIdSelected: any;
    constructor(
        private navPara: NavParams,
        private viewCtrl: ViewController,
        private patrolSvr: PatrolSvr,
        private events: Events,
        private logSvr: LoggerSvr,
        private uiSvr: UISvr
    ) {
        this.curPatrol = this.navPara.get('patrol');
        this.curMach = this.navPara.get('mach');
        this.PointCnt = this.navPara.get('pointCnt');
        this.MeasNode = this.navPara.get('measNode');
        this.MeasLocation = this.navPara.get('measLocation');
        this.PtObs = this.navPara.get('ptObs');
        this.PointHistory = this.navPara.get('phistory');

        this.curUser = {
            UserId: AppConfig.getInstance().UserId,
            UserName: AppConfig.getInstance().UserName
        }
    }

    ionViewDidEnter() {
        // this.PtObs.forEach(item=>{
        //     item.selected = false;
        // });
        this.events.subscribe("refreshObsHis", (hdata) => {
            this.refreshObsHis(hdata);
        });
    }
    //页面销毁前取消订阅事件
    ionViewWillUnload() {
        this.events.unsubscribe("refreshObsHis");
    }

    dismiss() {
        this.viewCtrl.dismiss().then(() => {
            this.events.publish('fetchNodes');
        })
    }

    ObsItemSelect(item) {
        if (item) {
            // this.saveObsData([item]);
        }
    }

    getObsValues(item) {
        if (item) {
            this.seletedObs = [item];
        }
    }

    saveObsData(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let arrObs = this.seletedObs;
            if (arrObs && arrObs.length > 0) {
                let obsIds = [], obsNames = [];
                arrObs.forEach(obs => {
                    obsIds.push(obs.ID);
                    obsNames.push(obs.NAME);
                });
                let pt = this.MeasNode;
                let patrol = this.curPatrol;
                this.patrolSvr.saveObsData(patrol.PatrolId, patrol.PlanId, pt, pt.RFID, obsIds, obsNames, this.curUser.UserId, this.curUser.UserName, this.Des).then((dataId) => {
                    this.events.publish('refreshLastValue', pt.NodeId, true);
                    this.uiSvr.showLoading("数据保存成功", 1000);
                    resolve(true);
                }, (err) => {
                    this.uiSvr.alert("数据保存失败", '测点' + this.MeasNode.NodeName + '的数据 ' + obsNames.join(',') + ' 保存失败！参考信息：' + err);
                    this.logSvr.log('save numeric data faild :', err, true);
                    reject('测点' + this.MeasNode.NodeName + '的数据 ' + obsNames.join(',') + ' 保存失败！参考信息：' + err);
                }).catch(err => {
                    this.uiSvr.alert("数据保存失败", '测点' + this.MeasNode.NodeName + '的数据 ' + obsNames.join(',') + ' 保存失败！参考信息：' + err);
                    reject('测点' + this.MeasNode.NodeName + '的数据 ' + obsNames.join(',') + ' 保存失败！参考信息：' + err);
                });
            }else{
                this.uiSvr.alert('提示', '没有选择任何记录');
                reject("没有选择任何记录");
            }
        });
    }

    goPre() {
        this.events.publish('preObsPoint');
    }

    goNext() {
        this.saveObsData().then((res)=>{
            this.events.publish('nextObsPoint');
        }, (err)=>{
            // this.uiSvr.alert('提示', err);
        });
    }

    refreshObsHis(hdata) {
        this.PointHistory = hdata;
    }

    deletePatrolData(data) {
        if (!data) {
            return;
        }
        this.patrolSvr.deleteOnePatrolData(data.PatrolDataId).then((res) => {
            this.events.publish('refreshLastValue', (data.NodeId));
            this.PointHistory.splice(this.PointHistory.indexOf(data), 1);
        }, (err) => {
            this.uiSvr.alert('数据保存失败', '参考信息：' + err);
        });
    }
}