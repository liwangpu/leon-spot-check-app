import { Component, ViewChild, Input } from '@angular/core';
import { Slides, NavController } from 'ionic-angular';
import { LogonPage } from '../../logon/logon';
import { AdvsPage } from '../../advs/advs';
@Component({
    selector: 'page-home-stat-area',
    templateUrl: 'statArea.html'
})
export class StatAreaPage {

    @ViewChild(Slides) slides: Slides;
    @Input() isVisitor: boolean;
    src1: string;
    src2: string;
    adv1Link = AdvsPage;
    constructor(private navCtrl: NavController) {
        this.src1 = "assets/imgs/ads1.jpg";
        this.src2 = "assets/imgs/ads2.jpg";
    }

    gotoLogon() {
        this.navCtrl.push(LogonPage);
    }

    // slideChanged() {
    //     let currentIndex = this.slides.getActiveIndex();
    //     console.log(111,'Current index is', currentIndex);
    // }

    // onStopAutoPlay(){
    //     // console.log(111,'自动播放停止了'); 
    //     this.slides.startAutoplay();
    // }

    // onDrag(){
    //     console.log(111,'有人拖动我');  
    // }

}