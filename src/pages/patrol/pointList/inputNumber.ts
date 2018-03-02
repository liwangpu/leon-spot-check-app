import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavParams, ViewController, Events } from 'ionic-angular';
import { PatrolSvr } from '../../../services/services';
import { LoggerSvr } from '../../../services/loggerSvr';
import { AppConfig } from '../../../common/appConfig';
import { CommonHelper } from '../../../common/commonHelper';
import Chart from 'chart.js';
import { UISvr } from '../../../services/uiSvr';

@Component({
    templateUrl: 'inputNumber.html'
})
export class InputNumPage {
    curPatrol: any;
    curMach: any;
    curPoint: any;
    PointCnt = 0;
    MeasNode: any;
    MeasLocation: any;
    NewData: any;
    Accuracy = 5;//默认小数精度
    curUser: {
        UserId: number;
        UserName: string
    };
    helper = CommonHelper.getInstance();
    PointHistory: Array<any>;
    ctx: any;
    myChart: any;

    @ViewChild('histLine') histLine: ElementRef;

    alarmSet: any;
    alarmText: string;

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
        this.PointHistory = this.navPara.get('phistory');
        this.alarmSet = this.navPara.get('alarmSet');

        this.initData();
    }

    /**报警验证级别 */
    checkLevel() {
        this.alarmText = "";
        this.alarmSet.forEach(alarm => {
            if (parseFloat(this.NewData.Numeric) > parseFloat(alarm.Value)) {
                this.alarmText = alarm.Text;
            }
        });
    }

    ionViewDidEnter() {
        setTimeout(() => {
            window.document.getElementById('numTxt').focus();
        }, 100);

        this.events.subscribe("refreshNumHis", (hdata) => {
            this.refreshHistory(hdata).then(() => {
                this.refreshChart();
            });
        });
        this.refreshChart();
    }

    //页面销毁前取消订阅事件
    ionViewWillUnload() {
        this.events.unsubscribe("refreshNumHis");
    }

    initData() {
        this.curUser = {
            UserId: AppConfig.getInstance().UserId,
            UserName: AppConfig.getInstance().UserName
        }

        this.NewData = {
            Numeric: null,
            Obs: '',
            Des: ''
        }
    }

    dismiss() {
        this.viewCtrl.dismiss().then(() => {
            this.events.publish('fetchNodes');
        })
    }

    /**
     * 保存数据方法
     */
    saveNumericData(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if (!this.MeasNode) {
                resolve(0);
                return;
            }
            if (!this.helper.isFloat(this.NewData.Numeric) && !this.helper.isInt(this.NewData.Numeric)) {

                reject("请输入数字类型的值");
                return;
            }
            let pt = this.MeasNode;
            let patrol = this.curPatrol;
            this.patrolSvr.saveNumericData(patrol.PatrolId, patrol.PlanId, pt, pt.RFID, this.NewData.Numeric, this.Accuracy, pt.Abbr, this.curUser.UserId, this.curUser.UserName, this.NewData.Des).then((dataId) => {
                this.events.publish('refreshLastValue', pt.NodeId);
                this.uiSvr.showLoading('数据保存成功', 1000);
                resolve(true);
            }, (err) => {
                this.logSvr.log('save numeric data faild :', err, true);
                this.uiSvr.alert('数据保存失败', '测点' + this.MeasNode.NodeName + '的数据 ' + this.NewData.Numeric + ' 保存失败！参考信息：' + err);
                reject('测点' + this.MeasNode.NodeName + '的数据 ' + this.NewData.Numeric + ' 保存失败！参考信息：' + err);
            }).catch((err) => {
                this.logSvr.log('save numeric data faild :', err, true);
                this.uiSvr.alert('数据保存失败', '测点' + this.MeasNode.NodeName + '的数据 ' + this.NewData.Numeric + ' 保存失败！参考信息：' + err);
                reject('测点' + this.MeasNode.NodeName + '的数据 ' + this.NewData.Numeric + ' 保存失败！参考信息：' + err);
            });
        });
    }

    goPre() {
        this.events.publish("preNumPoint");
    }

    goNext() {
        this.saveNumericData().then((res) => {
            this.events.publish("nextNumPoint");
        }, (err) => {
            this.uiSvr.alert('提示', err);
        })
    }

    /**
     * 更新历史数据
     * @param hdata 
     */
    refreshHistory(hdata): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.PointHistory = hdata;
            resolve(hdata);
        });
    }

    deletePatrolData(data) {
        if (!data) {
            return;
        }
        this.patrolSvr.deleteOnePatrolData(data.PatrolDataId).then((res) => {
            this.events.publish('refreshLastValue', (data.NodeId));
            this.PointHistory.splice(this.PointHistory.indexOf(data), 1);
            this.refreshChart();
        }, (err) => {
            this.uiSvr.alert('数据保存失败', '参考信息：' + err);
        });
    }

    /**
     * 加载chart数据
     */
    refreshChart() {
        let listdata = this.PointHistory;
        let zeroFlag = true;
        let arrData = [];
        let arrLabel = [];
        for (let idx = listdata.length - 1; idx >= 0; idx--) {
            arrData.push(listdata[idx].MeasValue);
            arrLabel.push(listdata[idx].SampleTime.substr(5, 11));
            if (zeroFlag && listdata[idx].MeasValue < 0)
                zeroFlag = false;
        }
        while (arrData.length < 2) {
            arrData.unshift(arrData[arrData.length - 1]);
            arrLabel.unshift('');
        }

        if (!this.ctx) {
            this.ctx = this.histLine.nativeElement.getContext('2d');
        }

        this.myChart = new Chart(this.ctx, {
            type: 'line',
            data: {
                labels: arrLabel,
                datasets: [
                    {
                        label: this.MeasNode.NodeName,
                        data: arrData,
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(255,99,132,0.4)",
                        borderColor: "rgba(255,99,132,1)",
                        borderWidth: 2,
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: "rgba(255,99,132,1)",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 2.5,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(255,99,132,1)",
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10
                    }
                ]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        },
                        stacked: true
                    }]
                },
                legend: {
                    display: false
                }
            }
        });
    }
}