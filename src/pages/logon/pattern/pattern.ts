import { Component } from '@angular/core';
import { NavParams, Events, NavController } from 'ionic-angular';
import $ from "jquery";
import * as PatternLock from 'PatternLock';

@Component({
    selector: 'app-pattern-lock',
    templateUrl: 'pattern.html'
})
export class PatternPage {

    userId: number;
    userName: string;
    lockPwd: number;
    patternMsg: string;
    lockset: any

    constructor(public params: NavParams, private events: Events, private nav: NavController) {
        this.userId = this.params.get('UserId');
        this.userName = this.params.get('UserName');
        this.lockPwd = this.params.get('patternPwd');

        this.patternMsg = "滑动手势解锁";
    }

    ionViewWillEnter() {

        this.lockset = new PatternLock("#patternHolder", {
            radius: 30,
            margin: 20,
            onDraw: (pattern) => {
                this.onDraw(pattern);
            }
        });
    }

    private onDraw(pattern) {
        if (pattern == this.lockPwd) {
            this.events.publish('login/pattern', true);
            this.nav.popToRoot();
        } else {
            $(".alertMsg").addClass("error");
            $(".alertMsg").html('手势码错误');
            this.lockset.error();
            setTimeout(() => {
                $(".alertMsg").removeClass("error");
                $(".alertMsg").html('滑动手势解锁');
                this.lockset.reset();
            }, 1000);
        }
    }
}