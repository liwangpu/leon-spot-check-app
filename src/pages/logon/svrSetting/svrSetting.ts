import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { UISvr } from '../../../services/uiSvr';
import { AppConfig } from '../../../common/appConfig';
import { AppCfgSvr } from '../../../services/appCfgSvr';
import { NativeService } from '../../../services/nativeService';

@Component({
    templateUrl: 'svrSetting.html'
})
export class SvrSettingPage {
    ipAdrr: string;//ip地址
    port: string;//端口
    suffix: string;//后缀
    newSvrUrl: string;
    scanSvrUrl: string;
    oldUrl: string;

    constructor(
        private uiSvr: UISvr,
        private navPara: NavParams,
        private appCfgSvr: AppCfgSvr,
        private nativeService: NativeService
    ) {
        //TODO:测试使用
        this.ipAdrr = '192.168.1.6';
        this.suffix = 'pms4';
        this.oldUrl = this.navPara.get('url');
        this.newSvrUrl = 'http://' + this.ipAdrr + ':' + this.port ? this.port : '80' + '/' + this.suffix;
    }

    /**生成服务器地址 */
    validUrl(): boolean {
        if (this.scanSvrUrl) {
            return true;
        }
        let url = "http://";
        if (this.ipAdrr && this.ipAdrr.match(/\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/)) {
            url += this.ipAdrr;
        }
        else {
            this.uiSvr.showLoading('请输入正确的IP地址', 800);
            return false;
        }
        if (this.port) {
            if (parseInt(this.port) < 0 || parseInt(this.port)) {
                this.uiSvr.alert('端口号错误', "请输入0~65535之间的整数");
                return false;
            }
            url += "/" + this.port.toString().trim();
        }
        if (this.suffix) {
            url += "/" + this.suffix;
        }

        this.newSvrUrl = url;
        return true;
    }

    scanUrl() {
        this.nativeService.barcodeScan().subscribe(text => {
            this.newSvrUrl = text;
            this.scanSvrUrl = text;
        }, err => {
            this.uiSvr.simpleTip(err);
        });
    }

    submit() {
        if (this.validUrl()) {
            AppConfig.getInstance().setHMSServiceUrl(this.newSvrUrl);
            this.appCfgSvr.SaveOrUpdateSvrUrl(this.newSvrUrl, this.oldUrl ? false : true).then((res) => {
                this.uiSvr.showLoading("数据保存成功!", 800);
            }, (err) => {
                this.uiSvr.alert("数据保存失败!", "参考消息:" + err);
            });
        }
    }
}