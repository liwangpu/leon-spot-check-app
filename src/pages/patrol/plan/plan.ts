import { Component } from '@angular/core';
import { NavController, ActionSheetController } from 'ionic-angular';
import { PatrolAsyncService } from '../../../services/patrolSvr/patrolAsync';
import { MachListPage } from './../machList/machList';
import { CommonHelper } from '../../../common/commonHelper';
import { DownPage } from '../down/down';
import { devinfo } from '../../../common/constants';
import { AppConfig } from '../../../common/appConfig';
import { PatrolSvr, HistorySvr } from '../../../services/services';
import { UISvr } from '../../../services/uiSvr';
import { LogonPage } from '../../logon/logon';
import { UploadPatrolPage } from '../uploadPatrol/uploadPatrol';
@Component({
    selector: 'page-patrol-plan',
    templateUrl: './plan.html'
})
export class PlanPage {
    PlanList: Array<any>;
    PlanListNext: Array<any>;
    commonHelper: CommonHelper;
    userName: string;
    stat: any;
    userId: number;

    constructor(private navCtrl: NavController,
        private patrolSvr: PatrolSvr,
        private historySvr: HistorySvr,
        private uiSvr: UISvr,
        private patrolAsync: PatrolAsyncService,
        private actionSheetCtrl: ActionSheetController
    ) {
        this.stat = {
            LastPatrol: {
                Id: 0,
                DBID: 0,
                PlanId: 0,
                Version: 0,
                Name: '无',
                Time: ''
            },
            PatrolCnt: 0,
            PatrolFinish: 0,
            TaskCnt: 0,
            TaskFinish: 0,
            AlarmCnt: 0,
            MissTouch: 0,
            WaitRecive: 0
        };

        this.PlanList = [];
        this.PlanListNext = [];
        this.commonHelper = CommonHelper.getInstance();
        this.userId = AppConfig.getInstance().UserId;
    }


    ionViewDidEnter() {
        if (!AppConfig.getInstance().UserName) {
            this.showLogin();
        }
        this.getLastPatrol();
        this.getWaiteRcv();
        this.getPlanList();
        this.getNextPlanList();
        this.userName = AppConfig.getInstance().UserName;
    }

    doRefresh(refresher) {
        this.getPlanList().then(() => {
            refresher.complete();
        }).catch(() => {
            refresher.complete();
        });
    }

    /**
     * 下载计划
     */
    onDownLoadPlan() {
        if (!AppConfig.getInstance().UserName) {
            this.showLogin();
        } else {
            this.navCtrl.push(DownPage, { planList: this.PlanList });
        }
    }

    /**显示登录 */
    private showLogin() {
        this.navCtrl.push(LogonPage);
    }

    /**
     * 上传已经执行的计划
     */
    onUploadExec() {
        if (this.stat.WaitRecive === 0) {
            this.uiSvr.simpleTip('没有可以回收的测点信息');
            return;
        }
        let defer = () => {
            return this.patrolAsync.uploadPatrolData('', AppConfig.getInstance().UserId, devinfo).toPromise();
        };
        this.uiSvr.loading(defer(), "数据上传中", () => {
            this.getWaiteRcv();
        });
    }

    /**上传动作 */
    doUploadPatrol() {
        if (!AppConfig.getInstance().UserName) {
            this.showLogin();
        } else {
            this.navCtrl.push(UploadPatrolPage, { Stat: this.stat });
        }
    }

    /**
     * 执行点检
     * @param patrolObj 
     */
    onDoPatrol(patrolObj) {
        this.navCtrl.push(MachListPage, { patrol: patrolObj.LocalPatrolId });
    }

    /**
     * 获取可以执行的计划列表
     */
    getPlanList(): Promise<any> {

        let getExcuPlanDefer = () => {
            return this.patrolSvr.getExcuPlan(AppConfig.getInstance().UserId).then((rdata) => {
                var tcnt = 0;
                var arrPatrolIds = [];
                for (let dataItem of rdata) {
                    tcnt += dataItem.TotalPoint;
                    arrPatrolIds.push(dataItem.LocalPatrolId);
                }
                this.stat.TaskCnt = tcnt;
                this.stat.PatrolCnt = rdata.length;
                this.PlanList = rdata;
                return Promise.resolve(arrPatrolIds);
            });
        }//getExcuPlanDefer

        let getPatrolAlarmDataCnt = (patrolIds: Array<number>) => {
            return this.historySvr.getPatrolAlarmDataCnt(patrolIds).then((rdata) => {
                this.stat.AlarmCnt = rdata;
                return Promise.resolve(patrolIds);
            });
        };//getPatrolAlarmDataCnt

        let getPatrolNotTouchCntDefer = (patrolIds: Array<number>) => {
            return this.historySvr.getPatrolNotTouchCnt(patrolIds).then((rdata) => {
                this.stat.MissTouch = rdata;
                return Promise.resolve();
            });
        }//getPatrolNotTouchCntDefer

        return getExcuPlanDefer().then(getPatrolAlarmDataCnt).then(getPatrolNotTouchCntDefer);
    }

    /**
     * 获取下期的计划列表
     */
    getNextPlanList(): Promise<any> {
        return this.patrolSvr.getNextExcuPlan(AppConfig.getInstance().UserId).then((rdata) => {
            this.PlanListNext = rdata;
            return Promise.resolve(rdata);
        });
    }

    /**
     * 获取可以回收的历史数据条目
     */
    getWaiteRcv(): Promise<any> {
        return this.historySvr.getWaitReceiveCnt(AppConfig.getInstance().UserId).then((rdata) => {
            this.stat.WaitRecive = rdata;
            return Promise.resolve(rdata);
        });
    }

    /**
     * 获取上次点检的执行情况
     */
    getLastPatrol(): Promise<any> {

        let getLastPatrolDefer = () => {
            return this.patrolSvr.getLastPatrol(AppConfig.getInstance().UserId).then((pdata) => {
                if (pdata) {
                    Object.assign(this.stat.LastPatrol, {
                        Id: pdata.LocalPatrolId,
                        DBID: pdata.DBID,
                        PlanId: pdata.PlanId,
                        Version: pdata.PlanVersion,
                        Name: pdata.PlanName,
                        Time: pdata.LastExec
                    });
                }
                else {
                    Object.assign(this.stat.LastPatrol, {
                        Id: 0,
                        DBID: 0,
                        PlanId: 0,
                        Version: 0,
                        Name: '无',
                        Time: ''
                    });
                }
                return Promise.resolve();
            });
        };//getLastPatrolDefer

        let getCurFinishedPatrolDefer = () => {
            return this.patrolSvr.getCurFinishedPatrolNode(AppConfig.getInstance().UserId).then((pList) => {
                // this.stat.PatrolFinish = pList.length;
                let pf = 0;
                var fcnt = 0;
                for (let pdata of pList) {
                    fcnt += pdata.FinishedPoint;
                    if (pdata.TotalPoint == pdata.FinishedPoint) {
                        pf++;
                    }
                }
                this.stat.PatrolFinish = pf;
                this.stat.TaskFinish = fcnt;
                return Promise.resolve();
            });
        };//getCurFinishedPatrolDefer

        return getLastPatrolDefer().then(getCurFinishedPatrolDefer);

        // return getCurFinishedPatrolDefer();

    }

    /**仅删除该次巡检 */
    delPatrol(patrol) {
        this.historySvr.getWaitReceiveCnt(this.userId, patrol.LocalPatrolId).then((cres) => {
            if (cres > 0) {
                this.uiSvr.confirm('', '当前计划存在未回收的巡检数据，是否继续删除?', () => {
                    this.patrolSvr.deletePatrolById(patrol.LocalPatrolId).then((res) => {
                        //刷新计划列表和巡检数据统计
                        this.ionViewDidEnter();
                    }, (err) => {
                        this.uiSvr.alert('数据删除失败', patrol.PlanName + ' 删除失败！参考信息：' + err);
                    });
                })
            } else {
                this.patrolSvr.deletePatrolById(patrol.LocalPatrolId).then((res) => {
                    //刷新计划列表和巡检数据统计
                    this.ionViewDidEnter();
                }, (err) => {
                    this.uiSvr.alert('数据删除失败', patrol.PlanName + ' 删除失败！参考信息：' + err);
                });
            }
        }).catch((err) => {
            this.uiSvr.alert('数据删除失败', patrol.PlanName + ' 删除失败！参考信息：' + err);
        });
    }

    /**
     * 删除计划及其历次巡检数据
     * @param patrol 
     */
    delPlanAndData(patrol) {
        //验证是否存在未回收的数据
        this.historySvr.getWaitReceiveCnt(this.userId, patrol.LocalPatrolId).then((cres) => {
            if (cres > 0) {
                this.uiSvr.confirm('', '当前计划存在未回收的巡检数据，是否继续删除?', () => {
                    this.patrolSvr.deletePlanAndData(patrol.DBID, patrol.PlanId, this.userId).then((res) => {
                        this.ionViewDidEnter();
                    }, (err) => {
                        this.uiSvr.alert('计划数据删除失败', patrol.PlanName + ' 删除失败！参考信息：' + err);
                    });
                });
            } else {
                this.patrolSvr.deletePlanAndData(patrol.DBID, patrol.PlanId, this.userId).then((res) => {
                    this.ionViewDidEnter();
                }, (err) => {
                    this.uiSvr.alert('计划数据删除失败', patrol.PlanName + ' 删除失败！参考信息：' + err);
                });
            }
        }).catch((err) => {
            this.uiSvr.alert('计划数据删除失败', patrol.PlanName + ' 删除失败！参考信息：' + err);
        });

    }

    /**删除所有数据 */
    clearAll() {
        this.historySvr.getWaitReceiveCnt(this.userId).then((cres) => {
            if (cres > 0) {
                this.uiSvr.confirm('', '存在未回收的巡检数据，是否继续删除?', () => {
                    this.patrolSvr.clearPlan(this.userId).then((res) => {
                        this.historySvr.clearData(this.userId).then((hres) => {
                            this.ionViewDidEnter();
                        }, (herr) => {
                            this.uiSvr.alert('计划数据删除失败', ' 清空所有计划和巡检数据失败！参考信息：' + herr);

                        });
                    }, (err) => {
                        this.uiSvr.alert('计划数据删除失败', ' 清空所有计划和巡检数据失败！参考信息：' + err);
                    })
                });
            } else {
                this.patrolSvr.clearPlan(this.userId).then((res) => {
                    this.historySvr.clearData(this.userId).then((hres) => {
                        this.ionViewDidEnter();
                    }, (herr) => {
                        this.uiSvr.alert('计划数据删除失败', ' 清空所有计划和巡检数据失败！参考信息：' + herr);
                    });
                }, (err) => {
                    this.uiSvr.alert('计划数据删除失败', ' 清空所有计划和巡检数据失败！参考信息：' + err);
                })
            }
        }).catch((err) => {
            this.uiSvr.alert('计划数据删除失败', ' 清空所有计划和巡检数据失败！参考信息：' + err);
        });

    }

    /**查看巡检计划数据 */
    doView(item) {
        this.uiSvr.alert('查看数据', '方法待补充，planId:' + item.PlanId);

    }

    /** 删除动作  */
    doDelete(item) {
        let acts = this.actionSheetCtrl.create({
            title: '请选择需要执行的动作',
            buttons: [{
                text: '删除该次巡检',
                handler: () => {
                    this.delPatrol(item);
                }
            }, {
                text: '删除该计划及其巡检数据',
                handler: () => {
                    this.delPlanAndData(item);
                }
            }, {
                text: '清空所有计划和巡检数据',
                role: 'destructive',
                handler: () => {
                    this.clearAll();
                }
            }, {
                text: '取消',
                role: 'cancel',
                handler: () => {

                }
            }
            ]
        });
        acts.present();
    }
}