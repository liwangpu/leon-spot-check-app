import { Directive, OnInit, HostListener, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
@Directive({
    selector: '[pageLink]'
})
export class PageLink implements OnInit {

    @Input() pageLink: string;
    @Input() pdata: any;
    constructor(private navCtrl: NavController, ) {

    }

    @HostListener('dblclick') onClick() {
        if (this.pageLink) {
            if (this.pageLink) {
                this.navCtrl.push(this.pageLink, this.pdata);
            }
        }
    }

    ngOnInit(): void {

    }
}