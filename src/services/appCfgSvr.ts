import { Injectable, Inject, forwardRef } from '@angular/core';
import { DataBase } from './dataBase/dataBase';
import { LoggerSvr } from './loggerSvr';
import { CommonHelper } from '../common/commonHelper';
import { AppConfig } from '../common/appConfig';
import { HttpService } from './httpService';

/**
 * AppCfg表的数据服务类
 */
@Injectable()
export class AppCfgSvr {
    appConfig: AppConfig;
    helper: CommonHelper
    constructor(
        @Inject(forwardRef(() => DataBase)) private dbSvr: DataBase,
        private logger: LoggerSvr,
        private http: HttpService
    ) {
        this.appConfig = AppConfig.getInstance();
        this.helper = CommonHelper.getInstance();
        if (dbSvr.Ins) {
            this.initTd().then(() => {
                console.log('T_AppCfg init succeed');
            }, () => {
                console.log('T_AppCfg init failed');
            });
        } else {
            this.dbSvr.openDB(null, this.appConfig.isMobile).then(() => {
                this.initTd().then(() => {
                    console.log('T_AppCfg init succeed');
                }, () => {
                    console.log('T_AppCfg init failed');
                });
            });
        }
    }

    private tbName = 'T_AppCfg';

    /**
     * 初始化数据库
     */
    public initTd(): Promise<any> {
        let sql = 'CREATE TABLE IF NOT EXISTS T_AppCfg ( AppCfgId integer primary key ,CfgValue text NOT NULL ,CfgKey text ,UserId integer  NOT NULL, UserName text NOT NULL, LoginName text NOT NULl, ImgPath text, PatternPwd text, CTime text , LoginTime text ) ';
        let svrSql = ' CREATE TABLE IF NOT EXISTS T_SvrCfg(SvrCfgId integer primary key, SvrUrl text NOT NULL, CTime text)';
        let modSql = 'CREATE TABLE IF NOT EXISTS T_UserMod(UserModId integer primary key, UserId integer NOT NULL, ModName text, ModUrl text, IconName text, OrderNum integer, CTime text)';
        this.dbSvr.execute(this.dbSvr.Ins, modSql, []);
        return this.dbSvr.nestedExecute(this.dbSvr.Ins, sql, svrSql, [], []);
    }

    /**
     * 根据loginName 获取数据记录
     * @param keyName 
     */
    public getByLoginName(keyName: string): Promise<any> {
        let sql = `select * from ${this.tbName} where LoginName=?`;
        return this.dbSvr.execute(this.dbSvr.Ins, sql, [keyName]).then((res) => {
            let rdata = this.helper.copyRows(res);
            return Promise.resolve(rdata);
        }).catch((err) => {
            return Promise.reject(err);
        });
    }

    /**根据用户id获取记录 */
    public getByUserId(userid: number): Promise<any> {
        let sql = `select * from ${this.tbName} where UserId=?`;
        return this.dbSvr.execute(this.dbSvr.Ins, sql, [userid]).then((res) => {
            let rdata = this.helper.copyRows(res);
            return Promise.resolve(rdata);
        }).catch((err) => {
            return Promise.reject(err);
        });
    }


    /**
     * 向数据表中插入数据
     * @param arrValues 固定格式 [ CfgValue, UserId,CTime,CfgKey, UserName,LoginTime, LoginName ]
     */
    public insertOrUpdate(arrValues: Array<any>): Promise<any> {
        if (!arrValues || arrValues.length <= 0) {
            this.logger.log('insertOrUpdate参数错误', '', true);
            return Promise.reject('insertOrUpdate参数错误');
        }
        let sql = `insert into ${this.tbName} (CfgValue, UserId,CTime,CfgKey,UserName, LoginTime, LoginName) values(?,?,?,?,?,?,?) `;

        let getKeyPromise = this.getByLoginName(arrValues[arrValues.length - 1]);

        let inOrUpdatePromise = (rows) => {
            if (rows = null || rows.length <= 0) {
                return this.dbSvr.execute(this.dbSvr.Ins, sql, arrValues).then(function (res) {
                    return Promise.resolve(res);
                }, function (err) {
                    this.logger.log("AppCfg insertOrUpdate faild:", err, true);
                    return Promise.reject(err);
                });
            } else {
                sql = `update  ${this.tbName} set LoginTime=? where LoginName=?`;
                return this.dbSvr.execute(this.dbSvr.Ins, sql, [arrValues[arrValues.length - 2], arrValues[arrValues.length - 1]]).then(function (res) {
                    return Promise.resolve(res);
                }, function (err) {
                    this.logger.log("AppCfg insertOrUpdate faild:", err, true);
                    return Promise.reject(err);
                });
            }
        }

        return getKeyPromise.then(inOrUpdatePromise).catch((error) => {
            this.logger.log("AppCfg getByLoginName faild:", error, true);
            return Promise.reject("AppCfg getByLoginName faild:" + error);
        });
    }

    /**
     * 根据cfgkey从表中删除数据
     * @param keyName 
     */
    public delByCfgkey(keyName: string): Promise<any> {
        var sql = 'delete from ' + this.tbName + ' where CfgKey=? ';
        return this.dbSvr.execute(this.dbSvr.Ins, sql, [keyName]).then((res) => {
            return Promise.resolve(res.rowAffected);
        }).catch((err) => {
            return Promise.reject(err);
        });
    }

    /**
     * 保存当前登录的用户信息
     * @param udata 
     */
    public setCurUserData(udata: any): Promise<any> {
        var vbinds = [JSON.stringify(udata), udata.UserId, CommonHelper.getInstance().dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'), 'CUser', udata.UserName, CommonHelper.getInstance().dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'), udata.LoginName];
        return this.insertOrUpdate(vbinds);
    }

    /**
     * 保存或编辑服务器地址
     * @param url 服务器地址
     * @param isInsert 是否插入
     */
    public SaveOrUpdateSvrUrl(url: string, isInsert?: boolean): Promise<any> {
        return new Promise<any>((resolve, reject) => {

            let sql = "update T_SvrCfg set SvrUrl=?,CTime=?";
            if (isInsert) {
                sql = "insert into T_SvrCfg(SvrUrl,CTime) values(?,?)";
            }
            let CTime = this.helper.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
            this.dbSvr.execute(this.dbSvr.Ins, sql, [url, CTime]).then((res) => {
                console.log(res);
                resolve(res);
            }, (err) => {
                debugger;
                console.log(err);
                reject(err);
            }).catch((err) => {
                debugger;
                console.log(err);
                reject(err);
            });
        });
    }

    /**获取服务器地址 */
    public getSvrUrl(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let sql = "select * from T_SvrCfg ";
            this.dbSvr.execute(this.dbSvr.Ins, sql, []).then((res) => {
                let rdata = this.helper.copySingle(res);
                resolve(rdata);
            }, (err) => {
                this.logger.log('get severurl failed', true);
                reject(err);
            });
        });
    }

    /**获取已登录过的用户列表信息 */
    public getLogonUserList(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let sql = "select * from T_AppCfg order by LoginTime desc";
            this.dbSvr.execute(this.dbSvr.Ins, sql, []).then((res) => {
                let list = this.helper.copyRows(res);
                let cdata = [];
                list.forEach(item => {
                    let oi = {
                        UserId: item.UserId,
                        UserName: item.UserName,
                        LoginName: item.LoginName,
                        ImgPath: item.ImgPath,
                        PatternPwd: item.PatternPwd
                    };
                    if (cdata.indexOf(oi) < 0)
                        cdata.push({
                            UserId: item.UserId,
                            UserName: item.UserName,
                            LoginName: item.LoginName,
                            ImgPath: item.ImgPath,
                            PatternPwd: item.PatternPwd
                        });
                });
                resolve(cdata);
            }, (err) => {
                this.logger.log('get severurl failed', true);
                reject(err);
            });
        });
    }


    /**登录方法 */
    public login(loginName: string, password: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let rest = `/Home/ReLogon`;
            let durl = `${AppConfig.getInstance().HMSServiceUrl}/${rest}`;
            let pdata = {
                LoginName: loginName,
                Password: password
            };
            this.http.post(durl, pdata).then((res) => {
                if (res.msg == "登录成功") {
                    let rdata = res.data.Data;
                    let UsrObj = {
                        LoginName: rdata.LoginName,
                        UserId: rdata.UserId,
                        UserName: rdata.UserName
                    }
                    this.setCurUserData(UsrObj).then(() => {
                        resolve(UsrObj);
                    })
                } else {
                    this.logger.log('login failed,' + res.msg, true);
                    reject(res.msg);
                }
            }, (err) => {
                this.logger.log('login failed,' + err.data.msg, true);
                reject(err.data.msg);
            }).catch((err) => {
                this.logger.log('login failed,' + err.message, true);
                reject(err.message);
            });
        });
    }

    /**
     * 更新用户手势码
     * @param userid 
     * @param pattern 
     */
    public updatePatternByUserId(userid: number, pattern: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let sql = 'update T_AppCfg set PatternPwd=? where UserId=?';
            this.dbSvr.execute(this.dbSvr.Ins, sql, [pattern, userid]).then((res) => {
                resolve(res);
            }, (err) => {
                this.logger.log('update PatternPwd failed,' + err, true);
                reject(err);
            });
        });
    }

    /**验证网络连接 */
    public checkInternet(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let rest = `/Home/ReLogon`;
            let durl = `${AppConfig.getInstance().HMSServiceUrl}/${rest}`;
            let pdata = {
                LoginName: 'admin',
                Password: 'password'
            };
            this.http.post(durl, pdata).then((res) => {
                if (res.success) {
                    resolve(true);
                } else {
                    reject(res.msg);
                }
            }, (err) => {
                reject(err.data.msg);
            }).catch((err) => {
                reject(err.message);
            });
        });
    }

    /**
     * 更新用户头像
     * @param userid 
     * @param imageData 
     */
    public updateUserImage(userId: number, imageData: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let sql = "update T_AppCfg set ImgPath=? where UserId=?";
            this.dbSvr.execute(this.dbSvr.Ins, sql, [imageData, userId]).then((res) => {
                resolve(true);
            }, (err) => {
                this.logger.log('update UserImage failed,' + err, true);
                reject(err);
            }).catch((err) => {
                this.logger.log('update UserImage failed,' + err, true);
                reject(err);
            });
        });
    }

    /**
     * 获取用户首页的快捷方式
     * @param userId 
     */
    public getUserMods(userId: number): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let sql = 'select * from T_UserMod where UserId=? order by OrderNum';
            this.dbSvr.execute(this.dbSvr.Ins, sql, [userId]).then((res) => {
                let list = this.helper.copyRows(res);
                resolve(list);
            }, (err) => {
                this.logger.log('get UserMods failed,' + err, true);
                reject(err);
            }).catch((err) => {
                this.logger.log('get UserMods failed,' + err, true);
                reject(err);
            });
        });
    }

    /**
     * 保存用户的快捷方式
     * @param userid 
     * @param modArr {ModName: '', ModUrl: '', IconName: '', OrderNum:0}
     */
    public insertUserMod(userid: number, mod: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let sql = 'insert into T_UserMod (UserId, ModName, ModUrl, IconName, OrderNum) values(?,?,?,?,?)';
            this.dbSvr.execute(this.dbSvr.Ins, sql, [userid, mod.ModName, mod.ModUrl, mod.IconName, mod.OrderNum ? mod.OrderNum : 0]).then((res) => {
                resolve(res);
            }, (err) => {
                this.logger.log('insertUserMod failed,' + err, true);
                reject(err);
            });
        });
    }

    /**
     * 删除快捷方式
     * @param userid 
     * @param modName 
     */
    public deleteUserMod(userid: number, modName: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let sql = "delete from T_UserMod where UserId=? and ModName=?";
            this.dbSvr.execute(this.dbSvr.Ins, sql, [userid, modName]).then((res) => {
                resolve(res);
            }, (err) => {
                this.logger.log('deleteUserMod failed,' + err, true);
                reject(err);
            }).catch((err) => {
                this.logger.log('deleteUserMod failed,' + err, true);
                reject(err);
            });
        });
    }

    /**
     * 对用户的快捷方式重新排序
     * @param userId 
     * @param modName 
     * @param oldOrder 原始序列
     * @param newOrder 新的序列
     */
    public reorderMod(userId: number, modName: string, oldOrder: number, newOrder: number): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let sql = "update T_UserMod set OrderNum=? where UserId=? and ModName=?";
            this.dbSvr.execute(this.dbSvr.Ins, sql, [newOrder, userId, modName]).then((res) => {
                resolve(res);
            }, (err) => {
                this.logger.log('Reorder UserMod failed,' + err, true);
            }).catch((err) => {
                this.logger.log('Reorder UserMod failed,' + err, true);
            });
            let sql1="";
            if (oldOrder > newOrder) {
                //向上拖拽排序,即原始顺序大于新的顺序,
                sql1="update T_UserMod set OrderNum=OrderNum+1 where UserId=? and OrderNum>=? and OrderNum<?";
            } else {
                //向下拖拽排序,即原始顺序小于新的顺序
                sql1="update T_UserMod set OrderNum=OrderNum-1 where UserId=? and OrderNum<=? and OrderNum>? ";
            }
            
            this.dbSvr.nestedExecute(this.dbSvr.Ins, sql1, sql, [userId, newOrder, oldOrder], [newOrder, userId, modName]).then((res) => {
                resolve(res);
            }, (err) => {
                this.logger.log('Reorder UserMod failed,' + err, true);
            }).catch((err) => {
                this.logger.log('Reorder UserMod failed,' + err, true);
            });
        });
    }
}