import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
@Component({
    selector: 'app-advs',
    templateUrl: 'advs.html'
})
export class AdvsPage {
    title: string;
    constructor(private navParams: NavParams) {
        this.title = this.navParams.get('title') ? this.navParams.get('title') : '详情';
    }
}