import { Component, Input } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { AppConfig } from '../../common/appConfig';
import { LogonPage } from '../../pages/logon/logon';
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
    @Input() authentication: boolean = false;//是否需要身份验证,如果需要身份验证,会弹出提示
    currentStyles: {};
    iconStyles: {};
    constructor(private navCtrl: NavController, private alertCtrl: AlertController) {
    }

    ngOnInit() {
        this.currentStyles = {
            'background-color': this.color ? this.color : '#5AA8D8'
        };
        this.iconStyles = {
            'zoom': this.iconZoom ? this.iconZoom : '2.0'
        };
    }

    onClick() {
        if (this.authentication && !AppConfig.getInstance().checkCustomer()) {
            let alertDialog = this.alertCtrl.create({
                title: '确认登录',
                message: '当前尚未登录任何用户，是否登录后继续操作？',
                buttons: [
                    {
                        text: '取消',
                        role: 'cancel'
                    },
                    {
                        text: '确认',
                        handler: () => {
                            this.navCtrl.push(LogonPage);
                        }
                    }
                ]
            });
            alertDialog.present();
            return;
        }

        if (this.url) {
            this.navCtrl.push(this.url, this.pdata);
        }
    }
}