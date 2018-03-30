import { Injectable } from "@angular/core";
import { LoadingController, AlertController, ToastController } from 'ionic-angular';

export interface ISeriesTaskLoading {
    //要执行的promises Function
    promiseFunction: Array<() => Promise<any>>;
    //promise执行时候的提示 与promiseFunction一一对应
    promiseMessage: Array<string>;
    //当出现个别promise 出现异常其他是否继续执行
    ignoreReject: boolean;
    //所有promises都执行成功地时的提示
    allSuccessMessage: string;
    //所有请求成功后回调
    allSucceedCallback?: Function;
}

/**
 * 界面提示服务类
 * 因为界面的loading等UI Controller没有办法测试,如果放到其他service
 * spec无法注入实例
 */
@Injectable()
export class UISvr {

    constructor(private loadingCtrl: LoadingController, private alertCtrol: AlertController, private toastCtrl: ToastController) {

    }


    /**
     * 简单的提示框
     * @param strTip 提示信息
     * @param iTime 提示显示时间 单位:秒,默认1.5秒
     * @param spinner 提示图标 默认没有
     */
    public simpleTip(strTip: string, iTime = 1.5, spinner = 'hide') {
        let showTime = iTime * 1000;
        let loader = this.loadingCtrl.create({
            content: strTip ? strTip : "数据加载中,请稍等...",
            duration: showTime,
            spinner: spinner
        });
        loader.present();
    }


    /**
     * 一系列请求Loading提示
     * @param task 
     */
    public seriesLoading(task: ISeriesTaskLoading) {
        let loader = this.loadingCtrl.create({
            content: "数据加载中,请稍等..."
        });
        loader.present();
        let seriesPro = task.promiseFunction.reduce((prev, curr, pidx) => {
            if (task.ignoreReject) {
                return prev.then(() => {
                    loader.setContent(task.promiseMessage[pidx]);
                    return curr();
                }, () => {
                    // 忽略上个任务的异常
                    loader.setContent(task.promiseMessage[pidx]);
                    return curr();
                });
            }
            else {
                return prev.then(() => {
                    loader.setContent(task.promiseMessage[pidx]);
                    return curr();
                });
            }
        }, Promise.resolve());

        seriesPro.then(() => {
            loader.setContent(task.allSuccessMessage);
            setTimeout(() => {
                loader.dismiss();
                if (task.allSucceedCallback)
                    task.allSucceedCallback();
            }, 1500);
        }).catch(() => {
            loader.setContent('数据请求中出现异常');
            setTimeout(() => {
                loader.dismiss();
            }, 500);
        });

    }


    /**
    * loading提示 执行一个promise后关闭
    * @param promise 
    * @param strTip 提示内容 default:数据加载中,请稍等...
    * @param onSucceedCallback 
    * @param onFailedCallback 
    */
    public loading(promise: Promise<any>, strTip?: string, onSucceedCallback?: Function, onFailedCallback?: Function): void {
        let loader = this.loadingCtrl.create({
            content: strTip ? strTip : "数据加载中,请稍等..."
        });
        loader.present();
        promise.then((msg?: string) => {
            if (msg) loader.setContent(msg);
            setTimeout(() => {
                loader.dismiss();
                if (onSucceedCallback) onSucceedCallback();
            }, 500);
        }).catch((error) => {
            loader.setContent(error);
            setTimeout(() => {
                loader.dismiss();
                if (onFailedCallback) onFailedCallback();
            }, 500);
        });
    }

    /**
     * 显示loading窗口
     * @param content 显示的文本内容
     * @param duration 加载时间,默认1s
     */
    public showLoading(content: string, duration?: number, callback?: Function): void {
        let load = this.loadingCtrl.create({
            content: content,
            duration: duration ? duration : 1000
        });
        load.present().then(() => {
            if (callback) callback();
        });
    }

    /**
     * 弹出提示窗口
     * @param title 标题
     * @param subTitle 副标题（可选）
     */
    public alert(title: string, subTitle?: string): void {
        let alert = this.alertCtrol.create({
            title: title,
            subTitle: subTitle ? subTitle : '',
            buttons: ['确定']
        });
        alert.present();
    }

    /**
     * 带回调函数的确认窗口
     * @param title 标题
     * @param subTitle 副标题 
     * @param callback 
     */
    public confirm(title: string, subTitle: string, callback: Function): void {
        let alert = this.alertCtrol.create({
            title: title,
            subTitle: subTitle ? subTitle : '',
            buttons: [{ text: '取消' }, {
                text: '确定',
                handler: () => {
                    callback();
                }
            }]
        });
        alert.present();
    }

    /**
     * 展示toast通知
     * @param mes 提示消息
     * @param duration 持续时间,默认1500ms
     * @param position 显示位置,top,middle,bottom
     * @param dismissCallback 销毁后的回调函数
     */
    public showToast(mes: string, duration: number, position: string, dismissCallback?: Function): void {

        let toast = this.toastCtrl.create({
            message: mes,
            duration: duration ? duration : 1500,
            position: position
        });

        if (dismissCallback) {
            toast.onDidDismiss(() => {
                dismissCallback();
            });
        }
        toast.present();
    }

}