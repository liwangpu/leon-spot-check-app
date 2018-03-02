import { Component } from '@angular/core';
import { NavParams, Modal, ModalController, Events } from 'ionic-angular';
import { nodeType } from '../../../common/constants';
import { PatrolSvr, HistorySvr } from '../../../services/services';
import { LoggerSvr } from '../../../services/loggerSvr';
import { InputNumPage } from './inputNumber';
import { InputObsPage } from './inputObs';
import { CommonHelper } from '../../../common/commonHelper';

@Component({
    templateUrl: 'pointList.html',
    selector: 'page-pointList',
    providers: [PatrolSvr, LoggerSvr]
})
export class PointListPage {
    curMach: any;
    curPatrol: any;
    NodeList: Array<any>;
    NodeListUnFinished: Array<any>;

    //模态窗体使用到的相关参数
    PointCnt = 0;
    MeasNode: any;
    MeasLocation: any;
    MeasIcon = 'create';
    measView: Modal;
    PointHistory: any;
    PtObs: Array<any>;
    selectType: string = 'all';
    AlarmMap: any;
    helper: CommonHelper = CommonHelper.getInstance();

    constructor(
        private navPara: NavParams,
        private patrolSvr: PatrolSvr,
        private logSvr: LoggerSvr,
        private modalCtrl: ModalController,
        private historySvr: HistorySvr,
        private events: Events
    ) {
        this.curPatrol = Object.assign({}, this.navPara.get('patrol'));
        this.curMach = Object.assign({}, this.navPara.get('mach'));

        this.AlarmMap = new Map();
        this.AlarmMap.set('0', '正常');
        this.AlarmMap.set('1', '预警');
        this.AlarmMap.set('2', '警告');
        this.AlarmMap.set('3', '报警');
        this.AlarmMap.set('4', '危险');
    }

    ionViewDidEnter() {
        this.NodeList = [];
        this.NodeListUnFinished = [];
        this.doRefresh();
        this.listenEvents();
    }

    ionViewWillUnload() {
        //页面销毁前取消订阅相关事件
        this.events.unsubscribe("refreshLastValue");
        this.events.unsubscribe("fetchNodes");
        this.events.unsubscribe("preNumPoint");
        this.events.unsubscribe("nextNumPoint");
        this.events.unsubscribe("preObsPoint");
        this.events.unsubscribe("nextObsPoint");
    }

    /**订阅事件，用以动态刷新数据 */
    listenEvents() {
        this.events.subscribe("refreshLastValue", (nodeId, isObs?) => {
            this.refreshLastValue(nodeId).then((hdata) => {
                if (isObs) {
                    this.events.publish("refreshObsHis", (hdata));
                } else {
                    this.events.publish("refreshNumHis", (hdata));
                }
            })
        });
        this.events.subscribe("fetchNodes", () => { this.fetchNodes() });
        this.events.subscribe("preNumPoint", () => { this.prePoint(); this.doRefresh(); });
        this.events.subscribe("nextNumPoint", () => { this.nextPoint(); this.doRefresh(); });
        this.events.subscribe("preObsPoint", () => { this.prePoint(); this.doRefresh(); });
        this.events.subscribe("nextObsPoint", () => { this.nextPoint(); this.doRefresh(); });
    }

    fetchNodes(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if (this.curMach.NodeId > 0) {
                this.patrolSvr.getSubNodeByPath(0, this.curMach.DBID, this.curMach.PlanId, this.curMach.PlanVersion, this.curMach.NodePath).then((nodes) => {
                    this.NodeList = nodes;
                    this.PointCnt = 0;
                    nodes.forEach(node => {
                        if (node.NodeType == nodeType.Point) {
                            this.PointCnt++;
                        }
                    });
                    this.fetchPatrolData().then((arrData) => {
                        arrData.forEach(hdata => {
                            let pt = this.getCachedNode(hdata.NodeId);
                            //pt存在且设置过上次采样值且上次采样时间晚于ndata---pt的数据更近，不做处理
                            if (pt && !(pt.LastData && pt.LastData.SampleTime > hdata.SampleTime)) {
                                //将采集值与测点关联，当前直接将PatrolData关联上了，考虑内存问题，可以简化结构后再关联
                                Object.assign(pt, { LastData: Object.assign({}, hdata) });
                            }
                            //计算用于显示的值
                            pt.LastData.ValueStr = pt.IsObs ? hdata.ObsName : hdata.MeasValue + hdata.Abbr;
                        });
                        resolve(true);
                    }, (err) => { });
                }, (err) => { this.logSvr.log('FetchNodes faild', err, true); reject(err); });
            } else {
                resolve(true);
            }
        });
    }

    doRefresh() {
        this.NodeList = [];
        this.NodeListUnFinished = [];
        this.fetchNodes().then((res) => {
            this.NodeList.forEach(node => {
                if ((!node.LastData && this.NodeListUnFinished.indexOf(node) < 0) ||
                    (node.LastData && !node.LastData.ValueStr && this.NodeListUnFinished.indexOf(node) < 0)) {
                    this.NodeListUnFinished.push(node);
                }
            });
        }).then(() => {
            //移除没有未完成测点的位置

            let tempArr = this.NodeListUnFinished;
            for (let i = 0; i < this.NodeListUnFinished.length; i++) {
                if (i > 0) {
                    if (this.NodeListUnFinished[i].NodeType == nodeType.Location &&
                        this.NodeListUnFinished[i - 1].NodeType == nodeType.Location) {
                        tempArr.splice(tempArr.indexOf(this.NodeListUnFinished[i - 1]), 1);
                    }
                    if (i == this.NodeListUnFinished.length - 1 && this.NodeListUnFinished[i].NodeType == nodeType.Location) {
                        tempArr.splice(tempArr.indexOf(this.NodeListUnFinished[i]), 1);
                    }
                }
            }
            this.NodeListUnFinished = tempArr;

            if (this.NodeListUnFinished.length == 1) {
                this.NodeListUnFinished = [];
            }
        });
    }

    /**
     * 从当前缓存的节点列表中获取指定的节点
     * @param nId 
     */
    getCachedNode(nId) {
        let node = null;
        let nidx = 0;
        for (let idx = 0; idx < this.NodeList.length; idx++) {
            if (this.NodeList[idx].NodeType == nodeType.Point) {
                nidx++;
            }
            if (this.NodeList[idx].NodeId == nId) {
                node = this.NodeList[idx];
                break;
            }
        }
        if (node)
            node.nIdx = nidx;
        return node;
    }

    /**
     * 获取本次巡检指定设备测点的巡检数据
     */
    fetchPatrolData(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.patrolSvr.getPatrolData(this.curPatrol.PatrolId, this.curMach.NodePath).then((listData) => {
                resolve(Object.assign([], listData));
            }, (err) => {
                this.logSvr.log('FetchPatrolData Faild', err, true)
                reject(err);
            });
        });
    }

    /**
     * 根据节点信号类型获取示意图标
     */
    getMeasIcon(node): string {
        if (!node)
            return 'pencil';
        if (node.IsObs)
            return 'eye';
        else
            return 'pencil';
    };

    getAlarmClass(hdata) {
        if (!hdata)
            return '';
        else
            return 'pt-alarm' + hdata.CurAlarm;
    };



    /**
     * 采集，调出采集数据输入界面(模态窗体)
     * @param node 当前测点
     */
    doMeas(node) {
        this.MeasNode = this.getCachedNode(node.NodeId);
        this.MeasLocation = this.getCachedNode(node.ParentNode);
        this.MeasIcon = this.getMeasIcon(this.MeasNode);
        if (node.NodeType != nodeType.Point) {
            return;
        }
        if (this.measView) {
            this.measView.dismiss();
            this.measView = null;
        }
        //报警级别
        let alarmset = JSON.parse(node.AlarmSet);
        let alarmTemp = [];
        if (alarmset.RULES.RULE && alarmset.RULES.RULE.LEVEL) {
            alarmset.RULES.RULE.LEVEL.forEach(level => {
                alarmTemp.push({
                    Level: level.LV,
                    Text: this.AlarmMap.get(level.LV),
                    Value: level.MAX
                });
            });
        }
        alarmTemp = alarmTemp.sort(this.helper.compare('Level'));

        this.loadPointObs(node);
        this.refreshLastValue(node.NodeId).then(() => {
            this.measView = this.modalCtrl.create(this.getMeasTamplate(node),
                {
                    //传递的参数，待补充
                    patrol: this.curPatrol,
                    mach: this.curMach,
                    pointCnt: this.PointCnt,
                    measNode: this.MeasNode,
                    measLocation: this.MeasLocation,
                    ptObs: this.PtObs,
                    phistory: this.PointHistory,
                    alarmSet: alarmTemp
                });
            this.measView.present();
        });

    }

    /**
     * 根据当前测点类型获取弹出模态窗体的页面
     * @param node 
     */
    getMeasTamplate(node) {
        if (!node) {
            return InputNumPage;
        }
        if (node.IsObs) {
            return InputObsPage;
        } else {
            return InputNumPage;
        }
    }

    loadPointObs(pt) {
        let arrObs = [];
        if (pt.IsObs && pt.Obs) {
            arrObs = JSON.parse(pt.Obs);
            for (let idx = 0; idx < arrObs.length; idx++) {
                //为后续多选做准备
                arrObs[idx].selected = false;
            }
        }
        this.PtObs = arrObs;
    }

    /**
     * 刷新指定测点的最近一次测量值
     * @param nid 测点ID
     */
    refreshLastValue(nid): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let pt = this.getCachedNode(nid);
            if (pt) {
                this.historySvr.getLastedData(pt.NodeId, pt.DBID, 5).then((listdata) => {
                    if (listdata && listdata.length) {
                        this.NodeListUnFinished.splice(this.NodeListUnFinished.indexOf(pt), 1);
                        let hdata = listdata[0];
                        Object.assign(pt, {
                            LastData: Object.assign({}, hdata)
                        });
                        //计算用于显示的值
                        pt.LastData.ValueStr = pt.IsObs ? hdata.ObsName : hdata.MeasValue + hdata.Abbr;
                    } else {
                        pt.LastData = null;
                    }
                    this.PointHistory = listdata;
                    // this.doRefresh();
                    resolve(listdata);
                }, (err) => {
                    this.logSvr.log('refresh LastValue faild', err, true);
                    reject(err);
                });
            }
        });
    }

    /**
     * 跳至下一测点
     */
    nextPoint() {
        let tmpNode = this.MeasNode;
        let nidx = 0;
        // let this.NodeListUnFinished = this.selectSeg == "unfinished" ? this.NodeListUnFinished : this.NodeList;
        for (let idx = 0; idx < this.NodeListUnFinished.length; idx++) {
            if (this.NodeListUnFinished[idx].NodeType == nodeType.Point)
                nidx++;
            if (this.NodeListUnFinished[idx].OrderNum > this.MeasNode.OrderNum && this.NodeListUnFinished[idx].NodeType == nodeType.Point) {
                tmpNode = this.NodeListUnFinished[idx];
                break;
            }
        }
        if (tmpNode.NodeId != this.MeasNode.NodeId) {
            tmpNode.nIdx = nidx;
            this.MeasNode = tmpNode;
            this.MeasLocation = this.MeasNode ? this.getCachedNode(this.MeasNode.ParentNode) : {};
            this.MeasIcon = this.getMeasIcon(this.MeasNode);
            this.loadPointObs(tmpNode);
            this.refreshLastValue(tmpNode.NodeId);
            this.doMeas(tmpNode);
        }
        else {
            this.measView.dismiss();
            console.log("The last point was clicked.");
        }
    }

    /**
     * 跳至上一测点
     */
    prePoint() {
        let tmpNode = this.MeasNode;
        let nidx = this.PointCnt + 1;
        for (let idx = this.NodeListUnFinished.length - 1; idx >= 0; idx--) {
            if (this.NodeListUnFinished[idx].NodeType == nodeType.Point)
                nidx--;
            if (this.NodeListUnFinished[idx].OrderNum < this.MeasNode.OrderNum && this.NodeListUnFinished[idx].NodeType == nodeType.Point) {
                tmpNode = this.NodeListUnFinished[idx];
                break;
            }
        }
        if (tmpNode.NodeId != this.MeasNode.NodeId) {
            tmpNode.nIdx = nidx;
            this.MeasNode = tmpNode;
            this.MeasLocation = this.MeasNode ? this.getCachedNode(this.MeasNode.ParentNode) : {};
            this.MeasIcon = this.getMeasIcon(this.MeasNode);
            this.loadPointObs(tmpNode);
            this.refreshLastValue(tmpNode.NodeId);
            this.doMeas(tmpNode);
        }
        else {
            this.measView.dismiss();
            console.log("The first point was clicked.");
        }
    }
}