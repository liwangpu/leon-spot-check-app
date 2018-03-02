import { Component, ViewChild } from '@angular/core';
import { DataBase } from '../../services/services';
import { AppConfig } from '../../common/appConfig';
import { StatAreaPage } from './statArea/statArea';
import { MachTreeAsyncService } from '../../services/machTreeSvr/machTreeAsync';
import { AppCfgSvr } from '../../services/appCfgSvr';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    appCfg: AppConfig = AppConfig.getInstance();
    isVisitor: boolean;
    preWarningCount: number;
    warningCount: number;
    alarmCount: number;
    dangerCount: number;

    @ViewChild('homeStatArea') statArea: StatAreaPage;
    constructor(
        private db: DataBase,
        private machTreeAsync: MachTreeAsyncService,
        private appCfgSvr: AppCfgSvr
    ) {
        this.isVisitor = true;
        this.preWarningCount = 0;
        this.warningCount = 0;
        this.alarmCount = 0;
        this.dangerCount = 0;

        if (!this.db.Ins) {
            this.db.openDB(null, this.appCfg.isMobile);
        }
    }

    ionViewDidLoad() {
        // this.refreshMachStatus();
    }

    ionViewWillEnter() {
        this.isVisitor = !this.appCfg.checkCustomer();
        this.statArea.slides.startAutoplay();
        this.refreshMachStatus();
    }

    ionViewDidLeave() {
        this.statArea.slides.stopAutoplay();
    }

    doRefresh(refresher) {
        this.refreshMachStatus().then(() => {
            refresher.complete();
        }).catch(() => {
            refresher.complete();
        });
    }

    /** 
     * 刷新各个设备状态统计信息
    */
    refreshMachStatus(): Promise<any> {
        let getSvrDefer = () => {
            return new Promise((resolve, reject) => {
                if (!this.isVisitor) {
                    this.appCfgSvr.getSvrUrl().then((res) => {
                        resolve(res.SvrUrl);
                    }).catch((err) => {
                        reject(err);
                    });
                }
                else {
                    //ionViewDidLoad事件里面不允许reject否则运行出现异常
                    resolve();
                }
            });
        };

        let getMachStatusDefer = (svrUrl) => {
            return new Promise((resolve, reject) => {
                if (svrUrl) {
                    this.machTreeAsync.getAlarmStatus(this.appCfg.UserId).then((res) => {
                        this.preWarningCount = res.data.PreWarning;
                        this.warningCount = res.data.Warning;
                        this.alarmCount = res.data.Alarm;
                        this.dangerCount = res.data.Danger;
                        resolve();
                    }).catch(() => {
                        resolve();
                    });
                }
                else {
                    resolve();
                }
            });
        };
        return getSvrDefer().then(getMachStatusDefer);
    }//refreshMachStatus

}//HomePage
