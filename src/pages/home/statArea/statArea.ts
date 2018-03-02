import { Component, ViewChild, Input } from '@angular/core';
import { Slides, NavController } from 'ionic-angular';
import { LogonPage } from '../../logon/logon';
@Component({
    selector: 'page-home-stat-area',
    templateUrl: 'statArea.html'
})
export class StatAreaPage {

    @ViewChild(Slides) slides: Slides;
    @Input() isVisitor: boolean;
    src1: string;
    src2: string;
    constructor(private navCtrl: NavController) {
        this.src1 = "assets/imgs/ads1.jpg";
        this.src2 = "assets/imgs/ads2.jpg";
    }

    gotoLogon() {
        this.navCtrl.push(LogonPage);
    }

}