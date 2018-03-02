import { Injectable } from '@angular/core';
import { AppConfig } from '../common/appConfig';
import { DebugType } from '../common/enums';
/**
 * 日志服务类
 * 提供系统日志记录,输出等服务
 */
@Injectable()
export class LoggerSvr {

    appConfigIns: AppConfig;
    // constructor(private appCfgServ: HMSParamService, private nfile: File) {

    // }

    constructor() {
        this.appConfigIns = AppConfig.getInstance();
    }

    /**
     * 将日志信息记录本地log文件中
     * @param strMsg 日志信息
     * @param strSource 日志源
     */
    private writeLog(strMsg: string, strSource: string): void {
        // if (this.appCfgServ.isMobile) {
        // let strFormat = `source:${strSource}    detail:${strMsg}`;
        // this.nfile.checkDir(this.appCfgServ.applicationDirectory, 'hmslog')
        //     .then(() => {
        //         return new Promise((res, rej) => {
        //             res();
        //         });
        //     }, (error) => {
        //         return this.nfile.createDir(this.appCfgServ.applicationDirectory, 'hmslog', true);
        //     }).then(() => {
        //         //TODO:write to local txt file
        //     });
        // }
        //TODO:临时测试
        console.log(111, 'writeLog', strMsg, strSource);
    }


    /**
     * 记录系统运行日志
     * @param strMsg 调试信息
     * @param strSource 信息源
     * @param bError 是否异常
     */
    public log(strMsg: string, strSource: any, bError?: boolean): void {
        if (bError) {
            if (this.appConfigIns.debugType == DebugType.debug) {
                console.error(strMsg, strSource);
            }
            else if (this.appConfigIns.debugType == DebugType.alert) {
                alert(strMsg + ':' + (strMsg ? JSON.stringify(strMsg) : ''));
            }
            else {
                this.writeLog(strMsg, strSource);
            }
        }
        else {
            if (this.appConfigIns.debugType == DebugType.debug) {
                console.log(strMsg, strSource);
            }
            else {
                this.writeLog(strMsg, strSource);
            }
        }
    }
}
