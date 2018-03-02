import { Component } from '@angular/core';
import { NavParams, NavController, ActionSheetController } from 'ionic-angular';
import { SetPatternPage } from '../setPattern/setPattern';
import { NativeService } from '../../../services/nativeService';
import { UISvr } from '../../../services/uiSvr';
import { AppCfgSvr } from '../../../services/appCfgSvr';
import { AppConfig } from '../../../common/appConfig';

@Component({
    templateUrl: 'userSetting.html'
})
export class UserSetPage {
    imageUrl: string;
    user: UserModel;

    constructor(
        private navPara: NavParams,
        private nav: NavController,
        private act: ActionSheetController,
        private nativeService: NativeService,
        private uiSvr: UISvr,
        private appCfgSvr: AppCfgSvr
    ) {
        this.user = new UserModel();
        this.user.UserId = this.navPara.get('UserId');
        this.user.LoginName = this.navPara.get('LoginName');
        this.user.UserName = this.navPara.get('UserName');
        this.user.PatternPwd = this.navPara.get('PatternPwd');
        this.user.ImgPath = this.navPara.get('ImgPath');

        this.user.ImgPath = this.user.ImgPath ? this.user.ImgPath : './assets/imgs/user.png';
    }

    changePattern() {
        this.nav.push(SetPatternPage, { UserId: this.user.UserId });
    }

    changeImg() {
        let acts = this.act.create({
            buttons: [
                {
                    text: '从相册选择',
                    handler: () => {
                        this.getPicture(0);
                    }
                }, {
                    text: '拍照',
                    handler: () => {
                        this.getPicture(1);
                    }
                }, {
                    text: '取消',
                    role: 'cancel',
                    handler: () => {

                    }
                }
            ]
        });

        acts.present();
    }

    private getPicture(type) {
        let options = {
            targetWidth: 400,
            targetHeight: 400,
            quality: 100,
            allowEdit: true
        };
        if (type === 1) {
            this.nativeService.getPictureByCamera(options).subscribe(imageBase64 => {
                // this.getPictureSuccess(imageBase64);
                this.appCfgSvr.updateUserImage(AppConfig.getInstance().UserId, imageBase64);
                this.user.ImgPath = imageBase64;
            }, err => {
                this.uiSvr.simpleTip(err);
            });
        } else {
            this.nativeService.getPictureByPhotoLibrary(options).subscribe(imageBase64 => {
                // this.getPictureSuccess(imageBase64);
                this.appCfgSvr.updateUserImage(AppConfig.getInstance().UserId, imageBase64);
                this.user.ImgPath = imageBase64;
            }, err => {
                this.uiSvr.simpleTip(err);
            });
        }
    }
}

class UserModel {
    UserId: Number;
    LoginName: string;
    UserName: string;
    PatternPwd: string;
    ImgPath: string;
}