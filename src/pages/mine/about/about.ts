import { Component } from '@angular/core';
import { NativeService } from '../../../services/nativeService';
import { UISvr } from '../../../services/uiSvr';

@Component({
    selector: 'page-about',
    templateUrl: './about.html'
})
export class AboutPage {
    curVer: any;
    constructor(private nativeService: NativeService,
        private uiSvr: UISvr
    ) {

    }

    ionViewWillEnter() {
        this.nativeService.getAppVerNum().subscribe(ver => {
            this.curVer = ver;
        }, err => {
            this.uiSvr.simpleTip(err);
        });
    }
}