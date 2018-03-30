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
    userModArr: Array<any> = [];//用户快捷方式
    isRefresh = false;

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
        // this.statArea.slides.update();
        this.refreshMachStatus();

        this.getCurUserMod();
    }

    ionViewDidLeave() {
        this.statArea.slides.stopAutoplay();
        // this.statArea.slides.update();
    }

    /**获取当前用户的快捷方式 */
    getCurUserMod() {
        if(this.isRefresh){
            return;
        }
        this.isRefresh = true;
        this.userModArr = [];
        this.appCfgSvr.getUserMods(this.appCfg.UserId).then((res) => {
            res.forEach(mod => {
                this.userModArr.push({
                    title: mod.ModName,
                    url: Object(mod.ModUrl),
                    simpleText: String(mod.ModName).substr(0, 1),
                    iconName: mod.IconName
                });
            });
            this.isRefresh = false;
        });
    }

    doRefresh(refresher) {
        if (this.isVisitor) {
            refresher.complete();
            return;
        }
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
                    this.preWarningCount = 0;
                    this.warningCount = 0;
                    this.alarmCount = 0;
                    this.dangerCount = 0;
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
