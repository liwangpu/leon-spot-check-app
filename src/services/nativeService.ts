import { Injectable } from "@angular/core";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Observable } from "rxjs";
import { IMAGE_SIZE, QUALITY_SIZE, UPDATE_URL } from '../common/constants';
import { LoggerSvr } from "./loggerSvr";
import { AppConfig } from "../common/appConfig";
import { HttpService } from './httpService';
import { AlertController } from "ionic-angular";
import { UISvr } from "./uiSvr";
import { AppVersion } from '@ionic-native/app-version';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

/**native 组件类服务*/
@Injectable()
export class NativeService {
    appCfg: AppConfig = AppConfig.getInstance();
    updateProgress = -1;    //下载进度
    constructor(
        private bcScan: BarcodeScanner,
        private camera: Camera,
        private logSvr: LoggerSvr,
        private httpService: HttpService,
        private appver: AppVersion,
        private alertCtrl: AlertController,
        private uiSvr: UISvr,
        private transfer: FileTransfer,
        private file: File,
        private fileOpener: FileOpener
    ) {

    }

    /**扫描条码/二维码 */
    barcodeScan(): Observable<string> {
        return Observable.create(observer => {
            this.bcScan.scan({
                prompt: '请将矩形扫描框对准条码/二维码',
                showTorchButton: true,//打开闪光灯
                showFlipCameraButton: true,//切换摄像头
                resultDisplayDuration: 0 //显示扫描文本的时间,0表示禁用,仅支持安卓
            }).then((res) => {
                if (res.cancelled) {
                    return;
                }
                observer.next(res.text);
            }).catch((err) => {
                this.logSvr.log("scan qrcode failed", "扫描二维码失败", true);
                observer.error(err);
            });
        });
    }

    /**
     * 使用cordova-plugin-camera获取照片
     * @param options 
     */
    private getPicture(options: CameraOptions): Observable<string> {
        let opts: CameraOptions = Object.assign({
            sourceType: this.camera.PictureSourceType.CAMERA,   //图片来源,CAMERA:拍照,PHOTOLIBRARY:相册
            destinationType: this.camera.DestinationType.DATA_URL,  //默认返回base64字符串,DATA_URL:base64   FILE_URI:图片路径
            quality: QUALITY_SIZE,  //图像质量，范围为0 - 100
            allowEdit: false,   //选择图片前是否允许编辑
            encodingType: this.camera.EncodingType.JPEG,
            targetWidth: IMAGE_SIZE,    //缩放图像的宽度(单位像素)
            targetHeight: IMAGE_SIZE,   //缩放图像的高度(单位像素)
            saveToPhotoAlbum: false,    //是否保存到相册
            correctOrientation: true    //设置相机拍摄的图像是否为正确的方向
        }, options);
        return Observable.create(observer => {
            this.camera.getPicture(opts).then((imgData: string) => {
                if (opts.destinationType === this.camera.DestinationType.DATA_URL) {
                    observer.next('data:image/jpg;base64,' + imgData);
                } else {
                    observer.next(imgData);
                }
            }).catch((err) => {
                if (err == 20) {
                    observer.error('没有权限,请在设置中开启权限');
                    return;
                }
                if (String(err).indexOf('cancel') > -1) {
                    return;
                }
                if (String(err).indexOf('No Image Selected') > -1) {
                    return;
                }
                this.logSvr.log("getPicture failed", "使用cordova-plugin-camera获取照片失败", true);
                observer.error(err);
            });
        });
    }

    /**
     * 通过拍照获取图片
     * @param options 
     */
    getPictureByCamera(options: CameraOptions = {}): Observable<string> {
        let opts: CameraOptions = Object.assign({
            sourceType: this.camera.PictureSourceType.CAMERA,
            destinationType: this.camera.DestinationType.DATA_URL//DATA_URL: 0 base64字符串, FILE_URI: 1图片路径
        }, options);
        return this.getPicture(opts);
    }

    /**
     * 通过相册选取图片
     * @param options 
     */
    getPictureByPhotoLibrary(options: CameraOptions = {}): Observable<string> {
        let opts: CameraOptions = Object.assign({
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            destinationType: this.camera.DestinationType.DATA_URL//DATA_URL: 0 base64字符串, FILE_URI: 1图片路径
        }, options);
        return this.getPicture(opts);
    }

    /****************************App 升级功能******************************/
    /**检查更新 */
    checkUpdate() {
        if (this.updateProgress > -1 && this.updateProgress < 100) {
            //正在更新
            let alert = this.alertCtrl.create({
                title: `下载进度：${this.updateProgress}%`,
                buttons: [{ text: '后台下载' }]
            });
            alert.present();
            let interval = setInterval(() => {
                alert.setTitle(`下载进度：${this.updateProgress}%`);
                if (this.updateProgress == 100) {
                    clearInterval(interval);
                    alert && alert.dismiss();
                }
            }, 500);
        } else {
            this.httpService.getXml(UPDATE_URL, null).then((res) => {
                if (res.success) {
                    let svrVer = res.data[0].android.version;
                    let apkUrl = res.data[0].android.url;
                    this.getAppVerNum().subscribe(ver => {
                        if (ver < svrVer) {
                            this.alertCtrl.create({
                                title: '升级',
                                subTitle: '发现新版本,是否立即升级？',
                                buttons: [{ text: '取消' },
                                {
                                    text: '确定',
                                    handler: () => {
                                        this.downloadApp(apkUrl);
                                    }
                                }
                                ]
                            }).present();
                        } else {
                            this.uiSvr.alert("已更新到最新版本!");
                        }
                    }, err => {
                        this.uiSvr.alert(err);
                    });
                } else {
                    this.uiSvr.alert(res.msg);
                }
            });
        }
    }

    /**获取当前App版本号 */
    getAppVerNum(): Observable<string> {
        return Observable.create(observe => {
            this.appver.getVersionNumber().then((res) => {
                observe.next(res);
            }, (err) => {
                observe.error(err);
            });
        });
    }

    /**下载并安装app */
    private downloadApp(url) {
        if (this.appCfg.isAndroid) {
            let backgroundProcess = false;
            let alert = this.alertCtrl.create({
                title: '下载进度：0%',
                enableBackdropDismiss: false,
                buttons: [{
                    text: '后台下载', handler: () => {
                        backgroundProcess = true;
                    }
                }]
            });
            alert.present();

            const fileTransfer: FileTransferObject = this.transfer.create();
            const apk = this.file.externalRootDirectory + 'download/android.apk'; //apk保存的目录
            fileTransfer.download(url, apk).then((entry) => {
                alert && alert.dismiss();
                this.fileOpener.open(entry.toURL(), 'application/vnd.android.package-archive').then(() => {
                    console.log("success");
                }, (err) => {
                    this.uiSvr.alert("应用安装失败", err);
                })
            }, (err) => {
                this.updateProgress = -1;
                alert && alert.dismiss();
                this.uiSvr.alert("本地升级失败", err);
            }).catch((err) => {
                alert && alert.dismiss();
                this.uiSvr.alert("本地升级失败", err);
            });

            let timer = null;
            fileTransfer.onProgress((event: ProgressEvent) => {
                let num = Math.floor(event.loaded / event.total * 100);
                this.updateProgress = num;
                if (!timer) {
                    timer = setTimeout(() => {
                        if (num === 100) {
                            alert.dismiss();
                        } else {
                            if (!backgroundProcess) {
                                alert.setTitle(`下载进度：${num}%`);
                            }
                        }
                        clearTimeout(timer);
                        timer = null;
                    }, 500);
                }
            })
        }
    }
}