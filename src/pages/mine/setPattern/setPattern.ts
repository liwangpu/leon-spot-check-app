import { Component } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';
import $ from "jquery";
import * as PatternLock from 'PatternLock';
import { AppCfgSvr } from '../../../services/appCfgSvr';
import { UISvr } from '../../../services/uiSvr';

@Component({
    selector: 'set-pattern',
    templateUrl: 'setPattern.html'
})
export class SetPatternPage {

    userId: number;
    firstPattern: string;
    secPattern: string;
    lockPwd: number;
    patternMsg: string;
    lockset: any;
    headerTitle: string;
    drawCnt: number;

    constructor(
        private params: NavParams,
        private nav: NavController,
        private AppCfgSvr: AppCfgSvr,
        private uiSvr: UISvr
    ) {
        this.userId = this.params.get('UserId');

        this.lockPwd = this.params.get('patternPwd');

        this.headerTitle = "设置手势密码";
        this.patternMsg = "请绘制手势密码";
        this.drawCnt = 0;
    }

    ionViewWillEnter() {

        this.lockset = new PatternLock("#patternHolder", {
            radius: 30,
            margin: 20,
            onDraw: (pattern) => {
                this.drawCnt++;
                this.doDraw(pattern);
            }
        });
    }

    private doDraw(pattern) {
        if (String(pattern).length < 5) {
            $(".alertMsg").addClass("error");
            $(".alertMsg").html('至少连接5个点，请重新绘制');
            this.lockset.error();
            setTimeout(() => {
                this.lockset.reset();
                this.doReset();
            }, 1000);
            return;
        }
        if (this.drawCnt == 1) {
            this.firstPattern = pattern;
            $(".alertMsg").removeClass("error");
            $(".alertMsg").html('请重复手势密码');
            this.lockset.reset();
        }
        if (this.drawCnt == 2) {
            this.secPattern = pattern;
            if (this.secPattern != this.firstPattern) {
                // this.patternMsg = "两次手势密码不一致";
                $(".alertMsg").addClass("error");
                $(".alertMsg").html('两次手势密码不一致，请重新绘制');
                this.lockset.error();
                setTimeout(() => {
                    this.lockset.reset();
                    this.doReset();
                }, 1000);

            } else {
                this.savePattern(this.userId, pattern).then((res) => {
                    if (res) {
                        this.uiSvr.showToast('手势码设置成功!', 800, 'middle');
                        this.nav.pop();
                    }
                })
            }
        }
    }

    private doReset() {
        this.drawCnt = 0;
        // this.headerTitle = "请设置手势密码";
    }

    /**保存手势密码 */
    private savePattern(userid: number, pattern: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.AppCfgSvr.updatePatternByUserId(userid, pattern).then((res) => {
                resolve(true);
            }, (err) => {
                reject(err);
            });
        });
    }
}