import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { AlarmLevel } from '../../common/enums';
@Component({
    selector: 'page-status',
    templateUrl: './status.html'
})
export class StatusPage {

    title: string = '设备状态';
    alarmLevel: number = AlarmLevel.Normal;
    constructor(private navParams: NavParams) {
        this.title = this.navParams.get('title');
        this.alarmLevel = this.navParams.get('alarmLevel');
    }
}