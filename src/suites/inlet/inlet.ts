import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppConfig } from '../../common/appConfig';
import { LogonPage } from '../../pages/logon/logon';
import { UISvr } from '../../services/uiSvr';
/**
 * 提供快捷入口按钮组件
 */
@Component({
    selector: 'app-inlet-suite',
    templateUrl: 'inlet.html'
})
export class InletSuite {
    @Input() title: string;//图标标题
    @Input() innerTitle: string;//图标内部文字
    @Input() color: string;//图标颜色
    @Input() url: string;//页面跳转路径
    @Input() pdata: any;//页面跳转参数
    @Input() iconName: string;//图标名称
    @Input() iconZoom: number;//图标倍率,默认2.0
    @Input() authentication: boolean = true;//是否需要身份验证,如果需要身份验证,会弹出提示
    @Input() simpleText: string = ""; //图标简称,默认为模块的第一个字符
    currentStyles: {};
    iconStyles: {};
    constructor(private navCtrl: NavController,
        private uiSvr: UISvr
    ) {
    }

    ngOnInit() {
        this.currentStyles = {
            'background-color': this.color ? this.color : '',
            'color': 'white',
            'font-size': '2em'
        };
        this.iconStyles = {
            'zoom': this.iconZoom ? this.iconZoom : '2.0',
            'margin': '0 auto'
        };
    }

    onClick() {
        if (this.authentication && !AppConfig.getInstance().checkCustomer()) {
            this.navCtrl.push(LogonPage);
            return;
        }
        if (this.url) {
            this.navCtrl.push(this.url, this.pdata);
            return;
        }
        else {
            this.uiSvr.simpleTip("即将上线...", 0.5);
            return;
        }
    }
}