import { Component } from '@angular/core';
import { ModuleArray } from '../../../common/constants';
import { AppConfig } from '../../../common/appConfig';
import { AppCfgSvr } from '../../../services/appCfgSvr';
import { UISvr } from '../../../services/uiSvr';

@Component({
    templateUrl: 'editModArea.html'
})
export class EditModAreaPage {
    Mods: Array<any>;
    appCfg: AppConfig = AppConfig.getInstance();

    constructor(private appCfgSvr: AppCfgSvr, private uiSvr: UISvr) {

    }

    ionViewWillEnter() {
        this.getMyMod();
    }

    private getMyMod() {
        this.Mods = [];
        this.appCfgSvr.getUserMods(this.appCfg.UserId).then((res) => {
            if (res.length > 0) {
                res.forEach(item => {
                    this.Mods.push({
                        ModName: item.ModName,
                        ModUrl: item.ModUrl,
                        OrderNum: item.OrderNum,
                        Selected: true,
                        IconName: item.IconName
                    });
                });
            }
            ModuleArray.forEach(mod => {
                let cnt = this.Mods.filter(x => {
                    return x.ModName == mod.ModName;
                })
                if (cnt.length == 0) {
                    this.Mods.push({
                        ModName: mod.ModName,
                        ModUrl: mod.ModUrl,
                        OrderNum: mod.OrderNum,
                        Selected: false,
                        IconName: mod.IconName
                    });
                }
            });
        });
    }

    saveMyMods(mod) {
        if (mod.Selected) {
            this.appCfgSvr.insertUserMod(this.appCfg.UserId, { ModName: mod.ModName, ModUrl: mod.ModUrl, IconName: mod.IconName, OrderNum: mod.OrderNum }).then((res) => {
                this.uiSvr.showToast(mod.ModName + '模块添加成功！', 1000, 'middle');
            }, (err) => {
                this.uiSvr.simpleTip(err);
            });
        } else {
            this.appCfgSvr.deleteUserMod(this.appCfg.UserId, mod.ModName).then((res) => {
                this.uiSvr.showToast(mod.ModName + '模块删除成功！', 1000, 'middle');
            }, (err) => {
                this.uiSvr.simpleTip(err);
            });
        }
    }

    reorderItems(indexes) {
        let element = this.Mods[indexes.from];
        this.Mods.splice(indexes.from, 1);
        this.Mods.splice(indexes.to, 0, element);

        this.appCfgSvr.reorderMod(this.appCfg.UserId, element.ModName, indexes.from, indexes.to).then((res) => { }, (err) => {
            this.uiSvr.simpleTip(err);
        });
    }

}