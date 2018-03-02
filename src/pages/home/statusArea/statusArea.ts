import { Component, Input } from '@angular/core';
import { StatusPage } from '../../status/status';
import { AlarmLevel } from '../../../common/enums';
@Component({
    selector: 'page-home-status-area',
    templateUrl: 'statusArea.html'
})
export class StatusAreaPage {

    preWarningUrl = StatusPage;
    warningUrl = StatusPage;
    alarmUrl = StatusPage;
    dangerUrl = StatusPage;
    preWarningParams: any;
    warningParams: any;
    alarmParams: any;
    dangerParams: any;
    @Input() preWarningCount: number = 0;
    @Input() warningCount: number = 0;
    @Input() alarmCount: number = 0;
    @Input() dangerCount: number = 0;
    constructor() {
        this.preWarningParams = { title: '预警设备信息', alarmLevel: AlarmLevel.PreWarning };
        this.warningParams = { title: '警告设备信息', alarmLevel: AlarmLevel.Warning };
        this.alarmParams = { title: '报警设备信息', alarmLevel: AlarmLevel.Alarm };
        this.dangerParams = { title: '危险设备信息', alarmLevel: AlarmLevel.Danger };
    }
}
