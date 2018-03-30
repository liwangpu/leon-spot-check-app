import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { LogonPage } from '../logon/logon';
import { AppConfig } from '../../common/appConfig';
import { AboutPage } from './about/about';
import { SyssetPage } from './sysset/sysset';
import { UserSetPage } from './userSetting/userSetting';
import { AppCfgSvr } from '../../services/appCfgSvr';
import { NativeService } from '../../services/nativeService';

@Component({
    templateUrl: './mine.html'
})
export class MinePage {
    appCfg: AppConfig = AppConfig.getInstance();
    user: UserModel;

    constructor(
        private nav: NavController,
        private events: Events,
        private appCfgSvr: AppCfgSvr,
        private nativeService: NativeService
    ) {
        this.user = new UserModel();
        this.user.ImgPath = './assets/imgs/user.png';
        this.events.subscribe('init/userId', (userid) => {
            //重新登录后获取用户系信息
            this.getCurUser(userid);
        });

    }

    ionViewWillEnter() {

        if (this.appCfg.UserId > 0) {
            this.getCurUser(this.appCfg.UserId);
        } else {
            this.clearCurUsr();
            // this.login();
        }

    }

    /**重置当前登录用户 */
    private clearCurUsr() {
        this.user.UserId = 0;
        this.user.UserName = "未登录";
        this.user.ImgPath = './assets/imgs/user.png';
        this.user.LoginName = "";
        this.user.PatternPwd = "";
    }

    /**获取当前登录用户 */
    private getCurUser(userid) {
        this.appCfgSvr.getByUserId(userid).then((res) => {
            if (res && res.length == 1) {
                this.user.UserId = userid;
                this.user.UserName = res[0].UserName;
                this.user.ImgPath = res[0].ImgPath ? res[0].ImgPath : './assets/imgs/user.png';
                this.user.LoginName = res[0].LoginName;
                this.user.PatternPwd = res[0].PatternPwd;
            }
        });
    }

    userSetting() {
        if (this.user.UserId > 0) {
            let UserObj = {
                UserId: this.user.UserId,
                UserName: this.user.UserName,
                LoginName: this.user.LoginName,
                PatternPwd: this.user.PatternPwd,
                ImgPath: this.user.ImgPath
            }
            this.nav.push(UserSetPage, UserObj);
        } else {
            this.clearCurUsr();
            this.login();
        }
    }

    login() {
        this.appCfg.clearUserInfo().then(() => {
            this.nav.push(LogonPage);
        });
    }

    /**退出登录 */
    logout() {
        this.clearCurUsr();
        this.appCfg.clearUserInfo().then(() => {
            this.nav.push(LogonPage);
        });
    }

    /**关于我们 */
    viewAbout() {
        this.nav.push(AboutPage);
    }

    /**系统设置 */
    sysSetting() {
        this.nav.push(SyssetPage);
    }

    /**检查更新 */
    checkUpdate() {
        this.nativeService.checkUpdate();
    }
}

class UserModel {
    UserId: number;
    UserName: string;
    LoginName: string;
    ImgPath: string;
    PatternPwd: string;
}
