import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { nodeType } from '../../../common/constants';
import { PointListPage } from '../pointList/pointList';
import { PatrolSvr } from '../../../services/services';
import { LoggerSvr } from '../../../services/loggerSvr';
import { NativeService } from '../../../services/nativeService';
import { UISvr } from '../../../services/uiSvr';

@Component({
    selector: 'page-MachList',
    templateUrl: 'machList.html'
})
export class MachListPage {
    curPatrol = {
        PatrolId: 0,
        DBID: '',
        PlanId: 0,
        PlanName: '无效数据',
        PlanVersion: 0
    };//当前巡检计划
    PatrolMach: Array<any>;
    machPaging: any;
    MachFetching = false;
    hasMoreRec = true;
    filtertTxt: string;

    constructor(private navCtrl: NavController,
        private navPara: NavParams,
        private patrolSvr: PatrolSvr,
        private logSvr: LoggerSvr,
        private nativeService: NativeService,
        private uiSvr: UISvr
    ) {
        this.curPatrol.PatrolId = this.navPara.get('patrol');
    }

    ionViewDidLoad() {
        this.reloadPatrol();
    }

    ionViewDidEnter() {
        this.initMachPaging();
        this.loadMoreMach();
    }

    reloadPatrol(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let patrolId = this.curPatrol.PatrolId;
            this.patrolSvr.getByLocalPatrolId(patrolId).then((pdata) => {
                if (pdata) {
                    Object.assign(this.curPatrol, pdata);
                    this.curPatrol.PatrolId = pdata.LocalPatrolId;
                } else {
                    this.curPatrol = {
                        PatrolId: 0,
                        DBID: '',
                        PlanId: 0,
                        PlanName: '无效数据',
                        PlanVersion: 0
                    };
                }
                resolve(this.curPatrol);
            }, (err) => {
                this.logSvr.log(" doRefresh patrol Info By patrolId faild ", err, true);
                reject(err);
            });
            //这里没有调用加载machlist 动作，是因为当前页面上的ion-infinite-scroll会构成第一次的加载，即直接触发了loadMoreMach
            //因此这里直接利用了这个特性，如果页面变更了，该逻辑需要重新调整。
        });
    };

    initMachPaging() {
        this.hasMoreRec = true;
        this.PatrolMach = [];
        this.machPaging = {
            curPage: -1,
            total: 0,
            pageSize: 8
        };
    }

    _fillOne(_machs, _idx, tmpAreaNode, tmpList): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let _mach = _machs.splice(0, 1)[0];
            _idx++;
            try {
                this.patrolSvr.getTaskCntByPath(this.curPatrol.PatrolId, _mach.NodePath).then((tres) => {
                    _mach.PointDone = tres;
                    this.patrolSvr.getSubNodeCntByPath(nodeType.Point, this.curPatrol.DBID, this.curPatrol.PlanId, this.curPatrol.PlanVersion, _mach.NodePath).then((res) => {
                        _mach.PointCount = res;
                        if (tmpAreaNode != _mach.ParentNode) {
                            tmpAreaNode = _mach.ParentNode;
                            //loadparent
                            this.patrolSvr.getNodeAndParent(_mach.ParentNode, _mach.DBID, _mach.PlanId, _mach.PlanVersion, this.curPatrol.PatrolId).then
                                ((areas) => {
                                    let area = areas.Node;
                                    if (areas.Parent) {
                                        area.NodeName = areas.Parent.NodeName + '--' + area.NodeName;
                                        area.PointCount = areas.PointCount;
                                        area.PointDone = areas.PointDone;
                                        area.ParentName = areas.Parent.NodeName;
                                    }
                                    console.log(areas);
                                    _mach.ParentName = areas.Parent.NodeName;
                                    tmpList.push(area);
                                    tmpList.push(_mach);
                                    if (_machs.length === 0) {

                                        this.PatrolMach = this.PatrolMach.concat(tmpList);
                                        resolve(true);
                                    } else {
                                        this._fillOne(_machs, _idx, tmpAreaNode, tmpList);
                                    }
                                }, (aerr) => {
                                    reject(aerr);
                                });
                        } else {
                            this.patrolSvr.getNodeAndParent(_mach.ParentNode, _mach.DBID, _mach.PlanId, _mach.PlanVersion, this.curPatrol.PatrolId).then((areas) => {
                                _mach.ParentName = areas.Parent.NodeName;
                            });
                            tmpList.push(_mach);
                            if (_machs.length === 0) {
                                this.PatrolMach = this.PatrolMach.concat(tmpList);
                                resolve(res);
                            } else {
                                this._fillOne(_machs, _idx, tmpAreaNode, tmpList);
                            }
                        }
                    }, (err) => {
                        reject(err);
                    })
                }, (terr) => {
                    reject(terr);
                });
            }
            catch (ex) {
                reject(ex);
            }
        });
    }

    /**
     * 获取设备列表
     * @param _machs 
     */
    fillMach(_machs): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let _idx = 0;
            let tmpAreaNode = 0;
            //逐条处理完成后逐条加入this.PatrolMach会对ui刷新造成较大的影响，所以先放入临时集合，处理完成后一次性加入
            //todo:另，获取设备所属车间信息和设备下测点完成情况的过程存在优化空间
            let tmpList = [];
            if (this.PatrolMach && this.PatrolMach.length > 0) {
                let tmpdata = this.PatrolMach[this.PatrolMach.length - 1];
                //接上一次查询的区域
                tmpAreaNode = tmpdata.NodeType == nodeType.Machine ? tmpdata.ParentNode : tmpdata.NodeId;
            }

            this._fillOne(_machs, _idx, tmpAreaNode, tmpList).then((res) => {
                resolve(res);
            }, (err) => { reject(err); });
            resolve(true);
        });
    }

    FetchMach(): Promise<any> {
        return new Promise<any>((resole, reject) => {
            if (this.MachFetching) {
                reject('Mach Loading is executing, pleas wait and try it again. ');
            } else {
                this.logSvr.log('Enter Mach Fetch ', null);
                this.MachFetching = true;
                if (this.curPatrol && this.curPatrol.PlanId > 0) {
                    this.patrolSvr.getNodePaging(this.curPatrol.DBID, this.curPatrol.PlanId, this.curPatrol.PlanVersion, this.machPaging.curPage, this.machPaging.pageSize).then((rdata) => {
                        this.machPaging.total = rdata.total;
                        let res = Object.assign([], rdata.data);
                        this.fillMach(res).then(() => {
                            this.MachFetching = false;
                            this.logSvr.log('FetchMach succeed ', null)
                        }, (err) => {

                        })
                        resole(true);
                    }, (err) => {
                        this.logSvr.log("FetchMach faild ", err, true)
                        reject(err);
                    });
                }
            }
        });
    }

    hasMoreMach(): boolean {
        let hasMore = false;
        if (this.curPatrol.PatrolId <= 0) {
            hasMore = false;
        } else {
            hasMore = this.machPaging.curPage == -1 || this.machPaging.total > (this.machPaging.curPage + 1) * this.machPaging.pageSize;
            // this.logSvr.log('hasMoreMach ' + hasMore + ':', this.machPaging);
        }
        this.hasMoreRec = hasMore;
        return hasMore;
    }

    loadMoreMach(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if (this.curPatrol.PatrolId > 0 && !this.MachFetching) {
                this.machPaging.curPage++;
                this.FetchMach().then(() => {
                    this.logSvr.log("Load more machine succeed.", this.machPaging);
                    resolve(true);
                }, (err) => {
                    this.logSvr.log("Load more machine failed.", this.machPaging, true);
                    reject(err);
                }).catch((err) => {
                    reject(err);
                });
            } else {
                resolve(true);
            }
        });
    }

    /**
     * 下拉刷新
     * @param refresher 
     */
    doRefresh(refresher) {
        this.initMachPaging();
        this.loadMoreMach().then(() => {
            refresher.complete();
        })
    }

    /**
     * 上拉加载
     * @param infinit 
     */
    doInfinite(infinit) {

        if (!this.hasMoreMach()) {
            infinit.complete();
            return;
        } else {
            this.loadMoreMach().then(() => {
                infinit.complete();
            })
        }
    }

    filterItems(searchbar) {
        //获取文本框里的
        let q = searchbar.target.value;
        if (q && q.trim() != '') {

            //否则 过滤一下 this.items
            this.filterMach();
        } else {
            this.initMachPaging();
            this.reloadPatrol().then(() => {
                this.loadMoreMach();
            });
        }
    }

    filterMach() {
        //否则 过滤一下 this.items
        let q = this.filtertTxt;
        this.PatrolMach = this.PatrolMach.filter((v) => {
            if (v.NodeName.toLowerCase().indexOf(q.toLowerCase()) > -1 || (v.ParentName.toLowerCase().indexOf(q.toLowerCase()) > -1)) {
                return true;
            }
            return false;
        })
    }

    /**扫描设备信息以过滤 */
    scanMach() {
        this.nativeService.barcodeScan().subscribe(text => {
            this.filtertTxt = text;
            this.filterMach();
        }, err=>{
            this.uiSvr.simpleTip(err);
        })
    }

    machItemClick(item) {
        if (item.NodeType == nodeType.Machine) {
            this.showPoints(item);
        }
    }

    /**
     * 加载巡检计划的设备测点
     * @param mach 
     */
    showPoints(mach) {
        this.navCtrl.push(PointListPage, {
            patrol: this.curPatrol,
            mach: mach
        });
    }

}