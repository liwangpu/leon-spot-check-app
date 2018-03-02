import { Injectable } from '@angular/core';
import { AppConfig } from '../../common/appConfig';
import { LoggerSvr } from '../loggerSvr';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Base64 } from '../../common/base64';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { X2JS } from '../../common/xml2json';
import { CommonHelper } from '../../common/commonHelper';
import { nodeType } from '../../common/constants';
import { PatrolSvr } from './patrolSvr';
import { HistorySvr } from '../historySvr/historySvr';
@Injectable()
export class PatrolAsyncService {


    commonHelper: CommonHelper;
    constructor(private http: HttpClient, private logger: LoggerSvr, private patrolSvr: PatrolSvr, private historySvr: HistorySvr) {
        this.commonHelper = CommonHelper.getInstance();
    }

    /**
     * 请求异常控制
     * @param operation 
     * @param result 
     */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            this.logger.log(`${operation} failed: ${error.message}`, operation, true);
            return Observable.of(result as T);
        };
    }

    private _getPath(npath, nlist, nId) {
        var _this = this;
        if (nId > 0) {
            for (var nidx = 0; nidx < nlist.length; nidx++) {
                var ntmp = nlist[nidx];
                if (ntmp.ID == nId) {
                    npath = '/' + ntmp.ID + npath;
                    if (ntmp.PARENT > 0)
                        npath = _this._getPath(npath, nlist, ntmp.PARENT);
                    break;
                }
            }
        }
        return npath;
    };


    /**
     * 下载的计划数据
     * @param userId 用户id
     * @param devId 点检仪UniqueId
     * @param planId 
     * @param itimes 
     */
    public getPatrolPlanData(userId: number | string, devId: string, planId: number | string, itimes?: number | string): Observable<any> {
        var rest = '/PmsApi/PatrolApi/GetPlanData';
        let durl = `${AppConfig.getInstance().HMSServiceUrl}/${rest}`;
        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        };
        let pdata = `iUser=${userId}&strDev=${devId}&strPlans=${planId}&iTimes=${itimes}`;

        //xml转为json
        let parseXml = (xml: string): any => {
            let x2js = new X2JS();
            let json = x2js.xml_str2json(xml);
            return json;
        }

        //解析存储object
        let parsePlan = (plans: any): { transPlans: Array<any>, transNRows: Array<any>, transNodes: Array<any> } => {
            let transPlans = [];
            let transNRows = [];
            let transNodes = [];
            if (plans && plans.PLAN) {
                let plan = plans.PLAN.length ? plans.PLAN[0] : plans.PLAN;
                let nrows = [];
                let nodes = [];
                let serUrl = AppConfig.getInstance().HMSServiceUrl;
                let execTimes = plan.EXEC.split(',');
                try {
                    for (let texec of execTimes) {
                        let tmpexec = texec.split('-');
                        let pcnt = plan.POINTS && plan.POINTS.POINT && plan.POINTS.POINT.length ? plan.POINTS.POINT.length : 0;
                        let startTime = this.commonHelper.toDatetime(tmpexec[0]);
                        let endTime = this.commonHelper.toDatetime(tmpexec[1]);
                        let tmparr = [plan.DBNO, plan.PLANID, plan.NAME, plan.VERSION, plan.EXECUSER, plan.EUNAME, plan.EULOGIN, pcnt, 0, plan.DOWNTIME, this.commonHelper.dateFormat(startTime, 'yyyy-MM-dd hh:mm:ss'), this.commonHelper.dateFormat(endTime, 'yyyy-MM-dd hh:mm:ss'), '', serUrl];
                        nrows.push(tmparr);
                    }

                    if (plan.NODES && plan.NODES.NODE) {
                        for (let ndata of plan.NODES.NODE) {
                            let ntype = this.commonHelper.getNodeType(ndata.NTYPE);
                            //nodePath
                            let npath = this._getPath('/', plan.NODES.NODE, ndata.ID);
                            nodes.push([plan.DBNO, plan.PLANID, plan.VERSION, ndata.ID, ndata.NAME, ndata.PARENT, ntype, ndata.ORDERNUM, ndata.EMARK, 0, 0, "", 0, '', '', '', npath]);
                        }
                    }
                    if (plan.POINTS && plan.POINTS.POINT) {

                        for (let ndata of plan.POINTS.POINT) {
                            let ptObs = [];
                            if (ndata.OBSID && ndata.OBSID != "") {
                                let obsIds = ndata.OBSID.split(',');
                                for (let idx = 0, len = obsIds.length; idx < len; idx++) {
                                    for (let obs of plan.OBSLIST.OBS) {
                                        if (obs.ID == obsIds[idx]) {
                                            ptObs.push(Object.assign({}, obs));

                                        }
                                    }
                                }
                            }
                            //ptPath
                            var ptpath = this._getPath('/' + ndata.ID + '/', plan.NODES.NODE, ndata.PARENT);
                            nodes.push([plan.DBNO, plan.PLANID, plan.VERSION, ndata.ID, ndata.NAME, ndata.PARENT, nodeType.Point, ndata.ORDERNUM, ndata.EMARK, ndata.ISMANUAL, ndata.ISOBS, ndata.UNITABBR, ndata.DATATYPE, ptObs.length <= 0 ? '' : JSON.stringify(ptObs), JSON.stringify(ndata.INSTRUMENT), JSON.stringify(ndata.ALARMSET), ptpath]);
                        }
                    }
                } catch (nex) {
                    throw new Error(`计划数据解析出错:${nex}`);
                }

                transPlans.push(plan);
                transNRows.push(nrows);
                transNodes.push(nodes);
            }
            return { transPlans: transPlans, transNRows: transNRows, transNodes: transNodes };
        }

        //更新本地db数据
        let refreshDb = (datas: { transPlans: Array<any>, transNRows: Array<any>, transNodes: Array<any> }) => {
            let funs = [];
            for (let idx in datas.transPlans) {
                let fun = () => {
                    let curPlan = datas.transPlans[idx];
                    let curNRow = datas.transNRows[idx];
                    let curNodes = datas.transNodes[idx];
                    let deletePatrolPro = this.patrolSvr.deletePatrol(curPlan.DBNO, curPlan.PLANID, curPlan.DOWNTIME);
                    let insertPatrolPro = this.patrolSvr.insertPatrol(curNRow);
                    let deletePatrolNodePro = this.patrolSvr.deletePatrolNode(curPlan.DBNO, curPlan.PLANID, curPlan.VERSION);
                    let insertPatrolNodePro = this.patrolSvr.insertPatrolNode(curNodes);

                    return deletePatrolPro.then(() => {
                        return insertPatrolPro;
                    }).then(() => {
                        return deletePatrolNodePro;
                    }).then(() => {
                        return insertPatrolNodePro;
                    });
                };

                funs.push(fun);
            }

            return funs.reduce((prev, curr) => {
                prev.then(curr);
            }, Promise.resolve());
        };


        let fetchDataPromise = this.http.post<string>(durl, pdata, httpOptions).map(vl => Base64.decode(vl)).map(vl => parseXml(vl)).map(vl => parsePlan(vl)).pipe(
            catchError(this.handleError('getPatrolPlanData', ''))
        ).toPromise();
        return Observable.fromPromise(fetchDataPromise.then(refreshDb));
    }



    /**
     * 获取可以下载的计划数据
     * @param userId 用户id
     * @param devId 点检仪UniqueId
     */
    public GetPatrolPlan(userId: number, devId: string): Observable<any> {
        let rest = 'PmsApi/PatrolApi/GetPlan';
        let durl = `${AppConfig.getInstance().HMSServiceUrl}/${rest}`;

        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        };

        let pdata = `iUser=${userId}&strDev=${devId}`;

        return this.http.post<any>(durl, pdata, httpOptions).pipe(
            catchError(this.handleError('getPatrolPlanData', ''))
        );
    }

    //obs and numeric
    //new {DataId=0, PlanId = 0, NodeId = 0, IsObs = 0, MeasValue = 0f, Accuracy = 0, Abbr = "", ObsId = "", ObsName = "", SampleTime = "", IsTouched = 0, TouchTime = "", CurAlarm = 0, Excutor = 0, Memo = "" };

    /* 将数据库的数据上传至服务器 ，直接诶从数据库检索需要上传的数据，然后分配次上传 */
    /**
     * 回收点检信息
     * @param dbId 
     * @param userId 
     * @param strDevice 
     */
    public uploadPatrolData(dbId: string, userId: number, strDevice: string): Observable<any> {
        let rest = 'PmsApi/PatrolApi/RcvNumberObs';
        let durl = `${AppConfig.getInstance().HMSServiceUrl}/${rest}`;
        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        };
        let idstart = 999999999;

        let getUploadDataDefer = () => {
            return this.historySvr.getUnUpload(dbId, idstart, 2)
        };

        let parseDataDefer = (datas) => {
            if (datas && datas.length) {
                idstart = datas[datas.length - 1].PatrolDataId;
                var arrdata = [];
                for (let data of datas) {
                    arrdata.push(JSON.stringify({ DataId: data.PatrolDataId, PlanId: data.PlanId, NodeId: data.NodeId, IsObs: data.IsObs, MeasValue: data.MeasValue, Accuracy: data.Accuracy, Abbr: data.Abbr, ObsId: data.ObsId, ObsName: data.ObsName, SampleTime: data.SampleTime, IsTouched: data.IsTouched, TouchTime: data.TouchTime, CurAlarm: data.CurAlarm, Excutor: data.Excutor, Memo: data.Memo }));
                }
                return Promise.resolve(arrdata);
            } else {
                return Promise.resolve([]);
            }
        };

        let uploadDefer = (datas) => {
            if (datas.length) {
                let strs = '';
                for (let item of datas) {
                    strs += `&strJsonData=${item}`;
                }
                let pdata = `iUser=${userId}&strDev=${strDevice}&${strs}`;
                return this.http.post<any>(durl, pdata, httpOptions).toPromise();
            }
            else {
                return Promise.resolve({ Data: [] });
            }
        };

        let cacheUploadDefer = (res) => {
            if (res.Data && res.Data.length) {
                return this.historySvr.setAsUploaded(res.Data);
            }
            else {
                return Promise.resolve(true);
            }
        };

        let test = getUploadDataDefer().then(parseDataDefer).then(uploadDefer).then(cacheUploadDefer).then(() => {
            return Promise.resolve('数据回收成功');
        }).catch(() => {
            return Promise.reject('数据回收失败');
        });
        return Observable.fromPromise(test);

    }

    /* 将数据库的数据上传至服务器 ，直接诶从数据库检索需要上传的数据，然后分配次上传 */
    /**
     * 回收点检信息(指定计划巡检数据)
     * @param dbId 
     * @param userId 
     * @param strDevice 
     * @param planIds
     */
    public uploadPatrolDataById(dbId: string, userId: number, strDevice: string, planIds: Array<any>): Observable<any> {
        let rest = 'PmsApi/PatrolApi/RcvNumberObs';
        let durl = `${AppConfig.getInstance().HMSServiceUrl}/${rest}`;
        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        };
        let idstart = 999999999;

        let getUploadDataDefer = () => {
            return this.historySvr.getUnUploadByIds(planIds, userId)
        };

        let parseDataDefer = (datas) => {
            if (datas && datas.length) {
                idstart = datas[datas.length - 1].PatrolDataId;
                var arrdata = [];
                for (let data of datas) {
                    arrdata.push(JSON.stringify({ DataId: data.PatrolDataId, PlanId: data.PlanId, NodeId: data.NodeId, IsObs: data.IsObs, MeasValue: data.MeasValue, Accuracy: data.Accuracy, Abbr: data.Abbr, ObsId: data.ObsId, ObsName: data.ObsName, SampleTime: data.SampleTime, IsTouched: data.IsTouched, TouchTime: data.TouchTime, CurAlarm: data.CurAlarm, Excutor: data.Excutor, Memo: data.Memo }));
                }
                return Promise.resolve(arrdata);
            } else {
                return Promise.resolve([]);
            }
        };

        let uploadDefer = (datas) => {
            if (datas.length) {
                let strs = '';
                for (let item of datas) {
                    strs += `&strJsonData=${item}`;
                }
                let pdata = `iUser=${userId}&strDev=${strDevice}&${strs}`;
                return this.http.post<any>(durl, pdata, httpOptions).toPromise();
            }
            else {
                return Promise.resolve({ Data: [] });
            }
        };

        let cacheUploadDefer = (res) => {
            if (res.Data && res.Data.length) {
                return this.historySvr.setAsUploaded(res.Data);
            }
            else {
                return Promise.resolve(true);
            }
        };
        let uploadById = getUploadDataDefer().then(parseDataDefer).then(uploadDefer).then(cacheUploadDefer).then(() => {
            return Promise.resolve('数据回收成功');
        }).catch(() => {
            return Promise.reject('数据回收失败');
        });
        return Observable.fromPromise(uploadById);
    }
}



