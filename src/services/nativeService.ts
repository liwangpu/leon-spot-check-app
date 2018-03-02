import { Injectable } from "@angular/core";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Observable } from "rxjs";
import { IMAGE_SIZE, QUALITY_SIZE } from '../common/constants';
import { LoggerSvr } from "./loggerSvr";

/**native 组件类服务*/
@Injectable()
export class NativeService {
    constructor(
        private bcScan: BarcodeScanner,
        private camera: Camera,
        private logSvr: LoggerSvr
    ) {

    }

    /**扫描条码/二维码 */
    barcodeScan(): Observable<string> {
        return Observable.create(observer => {
            this.bcScan.scan({
                prompt: '请将矩形扫描框对准条码/二维码',
                showTorchButton: true,//打开闪光灯
                showFlipCameraButton: true//切换摄像头
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
}