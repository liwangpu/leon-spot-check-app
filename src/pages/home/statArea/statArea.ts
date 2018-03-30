import { Component, ViewChild, Input} from '@angular/core';
import { Slides } from 'ionic-angular';
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
    constructor() {
        this.src1 = "./assets/imgs/ads1.jpg";
        this.src2 = "./assets/imgs/ads2.jpg";
    }
}