import { Injectable, Inject, forwardRef } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { DataBase, HistorySvr } from '../services';
import { nodeType } from '../../common/constants';
import { AlarmSvr } from '../alarmSvr/alarmSvr';
import { CommonHelper } from '../../common/commonHelper';
import { LoggerSvr } from '../loggerSvr';

@Injectable()
export class PatrolSvr {
    private isInit = false;
    private tbPatrol: string;
    private tbPatrolNode: string;
    private tbPatrolTask: string;
    public helper: CommonHelper

    constructor(@Inject(forwardRef(() => DataBase)) private db: DataBase,
        @Inject(forwardRef(() => HistorySvr)) private historySvr: HistorySvr,
        private alarmSvr: AlarmSvr,
        private logSvr: LoggerSvr) {
        this.helper = CommonHelper.getInstance();

        this.tbPatrol = 'T_LocalPatrol';
        this.tbPatrolNode = 'T_PatrolNode';
        this.tbPatrolTask = 'T_PatrolTask';

        if (this.db.Ins) {
            this.checkInit();
        }
    }

    private checkInit() {
        return new Promise((resolve, reject) => {
            if (this.isInit) {
                resolve(true);
            }
            else {
                this.initTb().then(() => {
                    resolve(true);
                });
            }
        });
    }

    /**
     * 初始化数据表
     * make sure tables are exists
     */
    private initTb(): Promise<any> {
        let sqlPatrol = 'CREATE TABLE IF NOT EXISTS T_LocalPatrol(LocalPatrolId integer primary key ,DBID text ,PlanId integer  NOT NULL ,PlanName text ,PlanVersion integer  NOT NULL , Executor integer  NOT NULL , ExecutorName text ,ExecutorLogin text ' + ' ,TotalPoint integer  NOT NULL ,DownTime text   ,StartTime text   ,EndTime text   ,FinishedPoint  integer  NOT NULL, LastExec text, ServerUrl text  ) ';
        let sqlPatrolNode = 'CREATE TABLE IF NOT EXISTS T_PatrolNode( PatrolNodeId integer primary key ,DBID text,PlanId integer  NOT NULL ,PlanVersion integer  NOT NULL ,	NodeId integer  NOT NULL ,NodeName text ,ParentNode integer  NOT NULL ' + ' ,NodeType integer  NOT NULL ,	OrderNum integer  NOT NULL ,RFID text ,IsManual integer  NOT NULL ,	IsObs integer  NOT NULL,	Abbr text ,DataType integer  NOT NULL  ' + ' , Obs text,DevSet text ,AlarmSet text,NodePath text) ';
        let sqlTask = 'CREATE TABLE IF NOT EXISTS T_PatrolTask ( PatrolTaskId integer primary key ,	DBID text, PlanId integer, PatrolDataId integer ,LocalPatrolId integer ,ExecTime text ,OrderNum integer  NOT NULL ,PatrolNodeId integer  NOT NULL,NodePath text )  ';
        //执行事务，依次创建数据表


        let createPatrolPro = () => {
            return this.db.execute(this.db.Ins, sqlPatrol, []).then((tres) => {
                this.logSvr.log(" make sure T_LocalPatrol exists success ", tres);
                return Promise.resolve(true);
            }, (terr) => {
                this.logSvr.log(" make sure T_LocalPatrol exists success ", terr);
                return Promise.resolve(true);//返回成功,确保下一个表继续检测是否创建
            });
        }

        let createPatrolNode = () => {
            return this.db.execute(this.db.Ins, sqlPatrolNode, []).then((tres) => {
                this.logSvr.log(" make sure T_PatrolNode exists success ", tres);
                return Promise.resolve(true);
            }, (terr) => {
                this.logSvr.log(" make sure T_PatrolNode exists success ", terr);
                return Promise.resolve(true);//返回成功,确保下一个表继续检测是否创建
            });
        }

        let createTask = () => {
            return this.db.execute(this.db.Ins, sqlTask, []).then((tres) => {
                this.logSvr.log(" make sure T_PatrolTask exists success ", tres);
                return Promise.resolve(true);
            }, (terr) => {
                this.logSvr.log(" make sure T_PatrolTask exists success ", terr);
                return Promise.resolve(true);//返回成功,确保下一个表继续检测是否创建
            });
        }

        return createPatrolPro().then(createPatrolNode).then(createTask);
    }

    /**
     * 向T_LocalPatrol插入完整的数据,pdataColl为行值数组，支持批量插入
     * @param pdataColl 行值顺序： DBID ,PlanId ,PlanName ,PlanVersion , Executor , ExecutorName,ExecutorLogin,TotalPoint ,FinishedPoint,DownTime ,StartTime ,EndTime ,LastExec,ServerUrl
     */
    insertPatrol(pdataColl: Array<Array<any>>): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if (!pdataColl || pdataColl.length <= 0) {
                this.logSvr.log('insert Patrol参数错误', '', true);
                reject('insert Patrol参数错误');
            } else {
                let sql = 'insert into ' + this.tbPatrol + ' (DBID ,PlanId ,PlanName ,PlanVersion , Executor , ExecutorName,ExecutorLogin,TotalPoint ,FinishedPoint,DownTime ,StartTime ,EndTime,LastExec,ServerUrl ) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?) ';
                pdataColl.forEach(data => {
                    let sqlPatrol = `select * from ${this.tbPatrol} where PlanId=? and Executor=? and StartTime=? and EndTime=?`;
                    this.db.execute(this.db.Ins, sqlPatrol, [data[1], data[4], data[10], data[11]]).then((tres) => {
                        let patrol = this.helper.copySingle(tres);
                        if (patrol) {
                            let updSql = `update ${this.tbPatrol} set PlanName=?, PlanVersion=?,TotalPoint=?,DownTime=?,LastExec where LocalPatrolId=?`;
                            this.db.execute(this.db.Ins, updSql, [data[2], data[3], data[7], data[9], data[12], patrol.LocalPatrolId]).then((res) => {
                                this.logSvr.log("update Patrol success:", {
                                    LocalPatrolId: patrol.LocalPatrolId
                                });
                                resolve(patrol.LocalPatrolId);
                            }, (err) => {
                                this.logSvr.log("update Patrol faild:", err, true);
                                reject(err);
                            })
                        } else {
                            this.db.execute(this.db.Ins, sql, data).then((res) => {
                                this.logSvr.log("insert Patrol success:", {
                                    res: res
                                });
                                resolve(res);
                            }).catch((err) => {
                                this.logSvr.log("insert Patrol faild:", err, true);
                                reject(err);
                            });
                        }
                    })
                });
            }
        });
    }

    /**
     * 删除指定版本的计划路线节点
     * @param dbId 
     * @param planId 
     * @param pversion 
     */
    public deletePatrolNode(dbId, planId, pversion) {
        return new Promise((resolve, reject) => {
            var vbinds = [dbId, planId];
            var sql = 'delete from ' + this.tbPatrolNode + ' where DBID=? and PlanId=? ';
            if (pversion >= 0) {
                sql += ' and PlanVersion=? ';
                vbinds.push(pversion);
            }

            this.db.execute(this.db.Ins, sql, vbinds).then((res) => {
                this.logSvr.log("delete PatrolNode success:", res);
                resolve(true);
            }).catch((err) => {
                this.logSvr.log("delete PatrolNode faild:", err, true);
                reject(err);
            });
        });
    };

    /**
     * 向T_PatrolNode插入完整的数据,pdataColl为行值数组，支持批量插入
     * 共16个值行值顺序： DBID ,PlanId ,PlanVersion ,	NodeId ,NodeName ,ParentNode ,
     * NodeType ,	OrderNum ,RFID ,IsManual ,IsObs,	Abbr ,DataType  ,Obs ,DevSet,AlarmSet,NodePath
     * @param pdataColl 
     */
    public insertPatrolNode(pdataColl) {
        return new Promise((resolve, reject) => {
            if (!pdataColl || pdataColl.length <= 0) {
                resolve(0);
            }
            var sql = 'insert into ' + this.tbPatrolNode + ' (DBID ,PlanId ,PlanVersion ,NodeId ,NodeName ,ParentNode , ' + ' NodeType ,	OrderNum ,RFID ,IsManual ,IsObs ,	Abbr ,DataType ,Obs,DevSet,AlarmSet ,NodePath) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ';
            this.db.insertCollection(this.db.Ins, sql, pdataColl).then((res) => {
                this.logSvr.log("insert PatrolNode:", {
                    res: res,
                    number: pdataColl.length
                });
                resolve(res);
            }).catch((err) => {
                this.logSvr.log("insert PatrolNode faild:", err, true);
                reject(err);
            });
        });
    };

    /**
     * 删除巡检任务极其巡检数据(计划已变更,并删除已经下载过的节点的任务)
     * @param userId 
     */
    public deletPatrolTask(userId, planId): Promise<any> {
        return new Promise((resolve, reject) => {
            //删除巡检任务
            let sql1 = `delete from T_PatrolData where PatrolDataId in (select T_PatrolTask.PatrolDataId from ${this.tbPatrolTask} where not exists(select 1 from T_LocalPatrol, T_PatrolNode where T_LocalPatrol.LocalPatrolId = T_PatrolTask.LocalPatrolId and T_LocalPatrol.Executor=? and T_LocalPatrol.PlanId=? and  T_PatrolNode.NodePath = T_PatrolTask.NodePath and T_LocalPatrol.PlanVersion = T_PatrolNode.PlanVersion ))`;
            //删除巡检任务
            let sql2 = `delete from ${this.tbPatrolTask} where not exists(select 1 from T_LocalPatrol, T_PatrolNode where T_LocalPatrol.LocalPatrolId = T_PatrolTask.LocalPatrolId and T_LocalPatrol.Executor=? and T_LocalPatrol.PlanId=? and  T_PatrolNode.NodePath = T_PatrolTask.NodePath and T_LocalPatrol.PlanVersion = T_PatrolNode.PlanVersion )`;
            this.db.nestedExecute(this.db.Ins, sql1, sql2, [userId, planId], [userId, planId]).then((res) => {
                //更新巡检计划已完成的节点数量
                let sql2 = `update T_LocalPatrol set FinishedPoint=(select count(1) from ${this.tbPatrolTask} where T_LocalPatrol.LocalPatrolId = T_PatrolTask.LocalPatrolId) where PlanId=?`;
                this.db.execute(this.db.Ins, sql2, [planId]).then((res) => {
                    resolve(res);
                }).catch((err) => {
                    this.logSvr.log("delete PatrolTask faild:", err, true);
                    reject(err);
                });
            }).catch((err) => {
                this.logSvr.log("delete PatrolTask faild:", err, true);
                reject(err);
            })
        });
    };

    /**
     * 删除执行期结束时间大于给定的时间的巡检计划
     * @param dbId DBID
     * @param planId 巡检计划ID
     * @param ctime 指定时间
     * @param userid 执行人ID
     */
    deletePatrol(dbId: string, planId: number, ctime: string, userid): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let vbinds = [dbId, planId, userid];
            let sqlfrom = ' from ' + this.tbPatrol + ' where DBID=? and PlanId=? and Executor=?';
            if (ctime) {
                sqlfrom += ' and EndTime>=? ';
                vbinds.push(ctime);
            }
            let sql = 'delete ' + sqlfrom;
            let sqltask = ' delete from ' + this.tbPatrolTask + ' where LocalPatrolId in ( select LocalPatrolId ' + sqlfrom + ') ';
            this.db.nestedExecute(this.db.Ins, sqltask, sql, vbinds, vbinds).then((res) => {
                this.logSvr.log("delete Patrol success:", res);
                resolve(true);
            }).catch((err) => {
                this.logSvr.log("delete Patrol faild:", err, true);
                reject(err);
            });
        });
    }

    /**
     * 只删除未开始的巡检计划
     * @param dbId 
     * @param planId 
     * @param ctime 
     * @param userid 
     */
    deleteUnStartPatrol(dbId: string, planId: number, ctime: string, userid): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let vbinds = [dbId, planId, userid];
            let sql = 'delete from ' + this.tbPatrol + ' where DBID=? and PlanId=? and Executor=?';
            if (ctime) {
                sql += ' and StartTime>=? and EndTime>=?';
                vbinds.push(ctime);
                vbinds.push(ctime);
            }
            this.db.execute(this.db.Ins, sql, vbinds).then((res) => {
                this.logSvr.log("delete Patrol success:", res);
                resolve(true);
            }).catch((err) => {
                this.logSvr.log("delete Patrol faild:", err, true);
                reject(err);
            });
        });
    }

    /**
     * 删除给定的patrol和巡检任务
     * @param patrolId 
     */
    deletePatrolById(patrolId: number): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let vbinds = [patrolId];
            let sql = 'delete from ' + this.tbPatrol + ' where LocalPatrolId=? ';
            let sqltask = 'delete from ' + this.tbPatrolTask + ' where LocalPatrolId=?';
            //依次删除巡检数据和巡检任务;
            this.db.nestedExecute(this.db.Ins, sql, sqltask, vbinds, vbinds).then((res) => {
                this.logSvr.log("delete Patrol success:", res);
                resolve(true);
            }).catch((err) => {
                this.logSvr.log("delete Patrol faild:", err, true);
                reject(err);
            })
        });
    }

    /**
     * 删除指定版本的计划路线节点
     * @param dbId DBID
     * @param planId 计划id
     * @param pversion 版本号
     */
    deletPatrolNode(dbId, planId, pversion): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let vbinds = [dbId, planId];
            let sql = 'delete from ' + this.tbPatrolNode + ' where DBID=? and PlanId=? ';
            if (pversion >= 0) {
                sql += ' and PlanVersion=? ';
                vbinds.push(pversion);
            }
            this.db.execute(this.db.Ins, sql, vbinds).then((res) => {
                this.logSvr.log("delete PatrolNode success:", res);
                resolve(true);
            }, (err) => {
                this.logSvr.log("delete PatrolNode faild:", err, true);
                reject(err);
            }).catch((err) => {
                this.logSvr.log("delete PatrolNode faild:", err, true);
                reject(err);
            });
        });
    }

    /**
     * 向PatrolTask中插入数据
     * @param pdataColl 共8个字段  DBID, PlanId, PatrolDataId ,LocalPatrolId ,PatrolNodeId, ExecTime ,OrderNum  ,NodePath
     */
    insertPatrolTask(pdataColl: Array<any>): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if (!pdataColl || pdataColl.length <= 0) {
                this.logSvr.log('insert Patrol Task 参数错误', '', true);
                reject('insert Patrol Task 参数错误');
            } else {
                let sql = 'insert into ' + this.tbPatrolTask + ' (DBID, PlanId,PatrolDataId ,LocalPatrolId ,PatrolNodeId, ExecTime ,OrderNum  ,NodePath) values(?,?,?,?,?,?,?,?) ';
                this.db.execute(this.db.Ins, sql, pdataColl).then((res) => {
                    this.logSvr.log("insert Patrol Task success:", res);
                    resolve(res.rowsAffected ? res.insertId : 0);
                }, (err) => {
                    this.logSvr.log("insert Patrol faild:", err, true);
                    reject(err);
                }).catch((err) => {
                    this.logSvr.log("insert Patrol faild:", err, true);
                    reject(err);
                })
            }
        })
    }

    /**
     * 删除巡检计划任务
     * @param dbId DBID
     * @param planId 计划ID
     * @param userid
     */
    deletePlanTask(dbId: string, planId: number, userid: number): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let vbinds = [dbId, planId, userid];
            let sql = 'delete from ' + this.tbPatrolTask + ' where DBID=? and PlanId=? and LocalPatrolId in(select LocalPatrolId from T_LocalPatrol where Executor=?)';
            this.db.execute(this.db.Ins, sql, vbinds).then((res) => {
                this.logSvr.log("delete PlanTask success:", res);
                resolve(true);
            }, (err) => {
                this.logSvr.log("delete PlanTask faild:", err, true);
                reject(err);
            }).catch((err) => {
                this.logSvr.log("delete PlanTask faild:", err, true);
                reject(err);
            });
        });
    }

    /**
     * 删除巡检计划，但不删除数据， --只删除patrol和node数据
     * @param dbId DBID
     * @param planId 计划ID
     */
    deletePlan(dbId: string, planId: number, userid: number): Promise<any> {
        return new Promise<any>((resolve, reject) => {

            this.deletePatrol(dbId, planId, null, userid).then((result) => {
                this.deletPatrolNode(dbId, planId, null).then((res) => {
                    resolve(true);
                }, (nerr) => {
                    reject(nerr);
                })
            }, (err) => {
                reject(err);
            })
        });
    }

    /**
     * 删除巡检计划并删除其巡检数据
     * @param dbId DBID
     * @param planId 计划ID
     * @param userid
     */
    deletePlanAndData(dbId: string, planId: number, userid: number): Promise<any> {
        return new Promise<any>((resolve, reject) => {

            this.deletePlan(dbId, planId, userid).then((res) => {
                this.deletePlanTask(dbId, planId, userid).then((tres) => {
                    this.historySvr.deletePlanHistory(dbId, planId, userid).then((hres) => {
                        resolve(hres);
                    }, (herr) => {
                        reject(herr);
                    });
                }, (terr) => {
                    reject(terr);
                });
            }, (err) => {
                reject(err);
            })
        });
    }

    /**
     * 清空所有的计划和巡检执行信息，不含历史数据
     * 1.删除当前用户巡检计划的节点
     * 2.删除当前用户巡检计划的任务
     * 3.删除当前用户的巡检计划
     * @param userid
     */
    clearPlan(userid: number): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let sqlTask = 'delete from ' + this.tbPatrolTask + ' where LocalPatrolId in(select LocalPatrolId from T_LocalPatrol where Executor=?)';
            let sqlNode = 'delete from ' + this.tbPatrolNode + ' where PlanId in(select distinct PlanId from T_LocalPatrol where Executor=?)';
            let sqlPatrol = 'delete from ' + this.tbPatrol + ' where Executor=?';
            this.db.nestedExecute(this.db.Ins, sqlTask, sqlNode, [userid], [userid]).then((res) => {
                this.db.execute(this.db.Ins, sqlPatrol, [userid]).then((tres) => {
                    resolve(tres);
                }, (terr) => {
                    reject(terr);
                });
            }, (err) => {
                this.logSvr.log("delete PatrolNode faild:", err, true);
                reject(err);
            }).catch((err) => {
                this.logSvr.log("delete PatrolNode faild:", err, true);
                reject(err);
            });
        });
    }

    /**
     * 从数据库中查询当前可以执行的计划
     * @param userId 
     */
    getExcuPlan(userId: number): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let cTime = this.helper.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
            let sql = 'select * from ' + this.tbPatrol + ' where StartTime<=?  and EndTime>=?  and Executor= ? order by PlanId ,StartTime ';
            let binds = [cTime, cTime, userId];
            this.db.execute(this.db.Ins, sql, binds).then((res) => {
                let list = this.helper.copyRows(res);
                resolve(list);
            }, (err) => {
                reject(err);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    /**
     * 获取当前未开始，即将开始的点检安排
     * @param userId 
     */
    getNextExcuPlan(userId: number): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let cTime = this.helper.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
            let sql = 'select * from ' + this.tbPatrol + ' where StartTime>? and Executor= ? order by PlanId ,StartTime ';
            let binds = [cTime, userId];
            this.db.execute(this.db.Ins, sql, binds).then((res) => {
                let list = this.helper.copyRows(res);
                let tmpList = [];
                let tmpId = 0;
                for (let idx = 0; idx < list.length; idx++) {
                    if (tmpId != list[idx].PlanId) {
                        tmpId = list[idx].PlanId;
                        tmpList.push(Object.assign({}, list[idx]));
                    }
                }
                resolve(tmpList);
            })
        });
    }

    /**
     * 根据Id获取patrol数据
     */
    getByLocalPatrolId(patrolId: number): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let sql = 'select * from ' + this.tbPatrol + ' where LocalPatrolId=? ';
            let binds = [patrolId];
            this.db.execute(this.db.Ins, sql, binds).then((res) => {
                this.logSvr.log('getByLocalPatrolId success', res);
                let item = this.helper.copySingle(res);
                resolve(item);
            }, (err) => {
                this.logSvr.log('getByLocalPatrolId faild', err, true);
                reject(err);
            }).catch((err) => {
                this.logSvr.log('getByLocalPatrolId faild', err, true);
                reject(err);
            });
        });
    }

    /**
     * 获取上一次执行过的巡检信息
     * @param userId 
     */
    getLastPatrol(userId: number): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let sql = 'select * from ' + this.tbPatrol + ' where LastExec >?  and Executor= ? order by LastExec desc limit 0,1 ';
            let binds = ['1900-01-01 00:00:00', userId];
            this.db.execute(this.db.Ins, sql, binds).then((res) => {
                this.logSvr.log('getLastPatrol success', res);
                let item = this.helper.copySingle(res);
                resolve(item);
            }, (err) => {
                this.logSvr.log('getLastPatrol faild', err, true);
                reject(err);
            }).catch((err) => {
                this.logSvr.log('getLastPatrol faild', err, true);
                reject(err);
            });
        });
    }

    /**
     * 获取当前执行期内已经执行完成的计划
     * @param userId 
     */
    getCurFinishedPatrol(userId: number): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let cTime = this.helper.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
            let sql = 'select * from ' + this.tbPatrol + ' where TotalPoint=FinishedPoint and StartTime <=? and EndTime>=?  and Executor= ? ';
            let binds = [cTime, cTime, userId];
            this.db.execute(this.db.Ins, sql, binds).then((res) => {
                this.logSvr.log('getCurFinishedPatrol success', res);
                let list = this.helper.copyRows(res);
                resolve(list);
            }, (err) => {
                this.logSvr.log('getCurFinishedPatrol faild', err, true);
                reject(err);
            }).catch((err) => {
                this.logSvr.log('getCurFinishedPatrol faild', err, true);
                reject(err);
            });
        });
    }

    /**
     * 获取当前执行期内的计划
     * @param userId 
     */
    getCurFinishedPatrolNode(userId: number): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let cTime = this.helper.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
            let sql = 'select * from ' + this.tbPatrol + ' where StartTime <=? and EndTime>=?  and Executor= ? ';
            let binds = [cTime, cTime, userId];
            this.db.execute(this.db.Ins, sql, binds).then((res) => {
                this.logSvr.log('getCurFinishedPatrol success', res);
                let list = this.helper.copyRows(res);
                resolve(list);
            }, (err) => {
                this.logSvr.log('getCurFinishedPatrol faild', err, true);
                reject(err);
            }).catch((err) => {
                this.logSvr.log('getCurFinishedPatrol faild', err, true);
                reject(err);
            });
        });
    }

    /**
     * 获取巡检计划中的设备设备节点
     * @param dbId DBID
     * @param planId 计划id
     * @param planVer 计划版本号
     * @param nPage 当前页码，从0开始
     * @param pageSize 每页记录数，默认15
     */
    getNodePaging(dbId: string, planId: number, planVer: number, nPage: number, pageSize: number): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.logSvr.log('getNodePaging ', {
                planId: planId,
                curPage: nPage,
                pageSize: pageSize
            });

            let psize = pageSize ? pageSize : 15;
            let total = 0;
            let sqlCnt = 'select count(*) as cnt from ' + this.tbPatrolNode + ' where DBID=? and PlanId=? and PlanVersion=? and NodeType=?  ';
            let sql = 'select * from ' + this.tbPatrolNode + ' where DBID=? and PlanId=? and PlanVersion=? and NodeType=?  order by OrderNum limit ?,? ';
            let binds = [dbId, planId, planVer, nodeType.Machine, nPage * psize, psize];
            this.db.execute(this.db.Ins, sqlCnt, [dbId, planId, planVer, nodeType.Machine]).then((res) => {
                total = res.rows.item(0).cnt;
                this.db.execute(this.db.Ins, sql, binds).then((res1) => {
                    this.logSvr.log('getNodePaging success', res1);
                    let list = this.helper.copyRows(res1);
                    resolve({
                        total: total,
                        data: list
                    });
                }, (err1) => {
                    this.logSvr.log('getNodePaging faild', err1, true);
                    reject(err1);
                })
            }, (err) => {
                reject(err);
            });
        });
    }

    /**
     * 获取指定巡检中，指定路径下的已执行的测点数量
     * @param patrolId 巡检ID
     * @param nodePath 测点路径
     */
    getTaskCntByPath(patrolId: number, nodePath: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let sql = 'select DISTINCT PatrolNodeId from ' + this.tbPatrolTask + ' where  LocalPatrolId=? and NodePath like ? ';
            this.db.execute(this.db.Ins, sql, [patrolId, nodePath + '%']).then((res) => {
                this.logSvr.log('getTaskCntByPath success ', res);
                resolve(res.rows.length);
            }, (err) => {
                this.logSvr.log('getTaskCntByPath faild ', err, true);
                reject(err);
            });
        });
    }

    /**
     * 获取指定巡检中已执行的测点数量
     * @param patrolId 
     */
    getTaskCntByPatrol(patrolId: number): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let sql = 'select DISTINCT PatrolNodeId from ' + this.tbPatrolTask + ' where  LocalPatrolId=? ';
            this.db.execute(this.db.Ins, sql, [patrolId]).then((res) => {
                this.logSvr.log('getTaskCntByPath success ', res);
                resolve(res.rows.length);
            }, (err) => {
                this.logSvr.log('getTaskCntByPath faild ', err, true);
                reject(err);
            }).catch((err) => {
                this.logSvr.log('getTaskCntByPath faild ', err, true);
                reject(err);
            });
        });
    }

    /**
     * 获取指定巡检数据对应的执行记录
     * @param dataId 
     */
    getTaskByData(dataId: number): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let sql = 'select * from ' + this.tbPatrolTask + ' where  PatrolDataId=? ';
            this.db.execute(this.db.Ins, sql, [dataId]).then((res) => {
                this.logSvr.log('getTaskByData success ', res);
                let item = this.helper.copySingle(res);
                resolve(item);
            }, (err) => {
                this.logSvr.log('getTaskByData faild ', err, true);
                reject(err);
            }).catch((err) => {
                this.logSvr.log('getTaskByData faild ', err, true);
                reject(err);
            });
        });
    }

    /**
     * 获取节点数据
     * @param nodeId 节点ID
     * @param dbId DBID
     * @param planId 计划ID
     * @param planVer 计划版本号
     */
    getNodeByNodeId(nodeId: number, dbId: string, planId: number, planVer: number): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let sql = 'select *  from ' + this.tbPatrolNode + ' where  NodeId=? and DBID=? and PlanId=? and PlanVersion=? ';
            this.db.execute(this.db.Ins, sql, [nodeId, dbId, planId, planVer]).then((res) => {
                this.logSvr.log('getNodeByNodeId success ', res);
                let item = this.helper.copySingle(res);
                resolve(item);
            }, (err) => {
                this.logSvr.log('getNodeByNodeId faild ', err, true);
                reject(err);
            }).catch((err) => {
                this.logSvr.log('getNodeByNodeId faild ', err, true);
                reject(err);
            });
        });
    }

    /**
     * 获取指定的节点和其父节点
     * @param nodeId 
     * @param dbId 
     * @param planId 
     * @param planVer 
     * @param patrolId
     */
    getNodeAndParent(nodeId: number, dbId: string, planId: number, planVer: number, patrolId: number): Promise<any> {
        return new Promise<any>((resolve, reject) => {

            let item = null, parent = null;
            let pointCount = 0, pointDone = 0;
            this.getNodeByNodeId(nodeId, dbId, planId, planVer).then((res) => {
                if (res) {
                    item = res;
                    this.getNodeByNodeId(item.ParentNode, dbId, planId, planVer).then((pres) => {
                        parent = pres;
                        this.getTaskCntByPath(patrolId, parent.NodePath).then((tres) => {
                            pointDone = tres;
                            this.getSubNodeCntByPath(nodeType.Point, dbId, planId, planVer, parent.NodePath).then((dres) => {
                                pointCount = dres;
                                resolve({
                                    Node: item,
                                    Parent: parent,
                                    PointCount: pointCount,
                                    PointDone: pointDone
                                });
                            });
                        });

                    }, (perr) => {
                        reject(perr);
                    })
                } else {
                    resolve({
                        Node: item,
                        Parent: parent,
                        PointCount: pointCount,
                        PointDone: pointDone
                    });
                }
            }, (err) => {
                this.logSvr.log("getNodeAndParent faild", err, true);
                reject(err);
            }).catch((err) => {
                this.logSvr.log("getNodeAndParent faild", err, true);
                reject(err);
            });
        });
    }

    /**
     * 根据节点路径获取子节点的数量
     * @param nType 
     * @param dbId 
     * @param planId 
     * @param planVer 
     * @param nPath 
     * @param containSelf 是否包含当前节点本身
     */
    getSubNodeCntByPath(nType: number, dbId: string, planId: number, planVer: number, nPath: string, containSelf?: number): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let binds = [dbId, planId, planVer, nPath + '%'];
            let sql = 'select count(*) cnt from ' + this.tbPatrolNode + ' where  DBID=? and PlanId=? and PlanVersion=? and NodePath like ? ';
            if (nType) {
                sql += ' and NodeType=? ';
                binds.push(nType);
            }
            if (!containSelf) {
                sql += ' and NodePath !=? ';
                binds.push(nPath);
            }
            this.db.execute(this.db.Ins, sql, binds).then((res) => {
                this.logSvr.log('getSubNodeCntByPath success ', res);
                resolve(res.rows.item(0).cnt);
            }, (err) => {
                this.logSvr.log('getSubNodeCntByPath faild ', err, true);
                reject(err);
            }).catch((err) => {
                this.logSvr.log('getSubNodeCntByPath faild ', err, true);
                reject(err);
            });
        });
    }

    /**
     * 根据节点路径获取子节点
     * @param nType 
     * @param dbId 
     * @param planId 
     * @param planVer 
     * @param nPath 
     * @param containSelf 根据节点路径获取子节点
     */
    getSubNodeByPath(nType: number, dbId: string, planId: number, planVer: number, nPath: string, containSelf?: number): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let binds = [dbId, planId, planVer, nPath + '%'];
            let sql = 'select * from ' + this.tbPatrolNode + ' where  DBID=? and PlanId=? and PlanVersion=? and NodePath like ? ';
            if (nType) {
                sql += ' and NodeType=? ';
                binds.push(nType);
            }
            if (!containSelf) {
                sql += ' and NodePath !=? ';
                binds.push(nPath);
            }
            sql += ' order by OrderNum ';
            this.db.execute(this.db.Ins, sql, binds).then((res) => {
                this.logSvr.log('getSubNodeByPath success ', res);
                let list = this.helper.copyRows(res);
                resolve(list);
            }, (err) => {
                this.logSvr.log('getSubNodeByPath faild ', err, true);
                reject(err);
            }).catch((err) => {
                this.logSvr.log('getSubNodeByPath faild ', err, true);
                reject(err);
            });
        });
    }

    /**
     * 获取指定巡检中指定节点下的 巡检数据
     * @param patrolId 
     * @param nPath 
     */
    getPatrolData(patrolId: number, nPath: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let sql = 'select h.* from ' + this.historySvr.tbPatrolData + ' h ,' + this.tbPatrolTask + ' t where h.PatrolDataId=t.PatrolDataId and t.LocalPatrolId=? and t.NodePath like ?  ';
            let binds = [patrolId, nPath + '%'];
            this.db.execute(this.db.Ins, sql, binds).then((res) => {
                this.logSvr.log('getPatrolData success ', res);
                let list = this.helper.copyRows(res);
                resolve(list);
            }, (err) => {
                this.logSvr.log('getPatrolData faild ', err, true);
                reject(err);
            }).catch((err) => {
                this.logSvr.log('getPatrolData faild ', err, true);
                reject(err);
            });
        });
    }

    /**
     * 根据巡检ID更新已完成的节点数
     * @param patrolId 
     */
    UpdateFinishedPoint(patrolId: number): Promise<any> {
        return new Promise<any>((resolve, reject) => {

            this.getTaskCntByPatrol(patrolId).then((cnt) => {
                let sql = 'update ' + this.tbPatrol + ' set FinishedPoint = ' + cnt + ' where LocalPatrolId =? ';
                let binds = [patrolId];
                this.db.execute(this.db.Ins, sql, binds).then((res) => {
                    this.logSvr.log('UpdateFinishedPoint success ', res);
                    resolve(true);
                }, (err) => {
                    this.logSvr.log('UpdateFinishedPoint faild ', err, true);
                    reject(err);
                });
            }, (terr) => {
                reject(terr);
            });
        });
    }

    /**
     * 验证标签是否触碰
     * @param emarkId 
     */
    checkEmarkTouch(emarkId): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let cTime = this.helper.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
            resolve({
                IsTouch: true,
                TouchTime: cTime
            });
        });
    }

    /**
     * 保存数值型的巡检数据，封装插入history、patroltask等关联动作,node 为核心属性与数据库一致测点数据
     * @param patrolId 
     * @param planId 
     * @param node 
     * @param emarkId 
     * @param measValue 
     * @param accuracy 
     * @param abbr 
     * @param userId 
     * @param userName 
     * @param memo 
     */
    saveNumericData(patrolId: number, planId: number, node, emarkId: number, measValue, accuracy: number, abbr: string, userId: number, userName: string, memo: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let cdate = new Date();
            let cTime = this.helper.dateFormat(cdate, 'yyyy-MM-dd hh:mm:ss');
            let touched = {
                IsTouch: false,
                TouchTime: ''
            };
            let alarmLevel = 0;
            let historyId = 0;
            //判断是否有触碰过电子标签
            this.checkEmarkTouch(emarkId).then((touch) => {
                Object.assign(touched, touch);
                // alarmLevel = this.alarmSvr.checkAlarm(node, measValue);
                if (node.IsObs == 1) {
                    alarmLevel = this.alarmSvr.checkObsAlarm(node, measValue);
                } else {
                    alarmLevel = this.alarmSvr.checkNumericAlarm(node, measValue);
                }
                this.historySvr.getLastedData(node.NodeId, node.DBID, 1, userId).then((listLast) => {
                    let lastData = listLast && listLast.length ? listLast[0] : null;
                    if (lastData && lastData.IsUpload == 0 && this.helper.dateDiff(cdate, this.helper.toDatetime(lastData.SampleTime)) < 5 * 60 * 1000) {
                        this.historySvr.updateNumericData(lastData.PatrolDataId, measValue, accuracy, cTime, alarmLevel, userId, userName, '').then((ures) => {
                            resolve(ures);
                        }, (uerr) => {
                            reject(uerr);
                        })
                    } else {
                        let hisData = [node.DBID, planId, node.NodeId, measValue, 0, '', '', abbr, cTime, accuracy, touched.IsTouch ? 1 : 0, touched.TouchTime, 0, 0, 0, alarmLevel, 0, 0, 0, 0, 0, 0, 0, userId, userName, '', memo];
                        this.historySvr.insertData(hisData).then((dataId) => {
                            historyId = dataId;
                            //插入 taskpatrol信息
                            let taskData = [node.DBID, planId, historyId, patrolId, node.PatrolNodeId, cTime, node.OrderNum, node.NodePath];
                            this.insertPatrolTask(taskData).then((taskId) => {
                                this.UpdateFinishedPoint(patrolId);
                                resolve(historyId);
                            }, (tserr) => {
                                reject(tserr);
                            });
                        }, (herr) => {
                            reject(herr);
                        });
                    }
                }, (lerr) => {
                    reject(lerr);
                });
            }, (toucherr) => {
                reject(toucherr);
            })
        });
    }

    /**
     * 保存obs型的巡检数据，封装插入history、patroltask等关联动作,node 为核心属性与数据库一致测点数据
     * @param patrolId 
     * @param planId 
     * @param node 
     * @param emarkId 
     * @param obsIds 
     * @param obsNames 
     * @param userId 
     * @param userName 
     * @param memo 
     */
    saveObsData(patrolId: number, planId: number, node, emarkId: number, obsIds, obsNames, userId: number, userName: string, memo: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {

            let cDate = new Date();
            let cTime = this.helper.dateFormat(cDate, 'yyyy-MM-dd hh:mm:ss');
            let touched = {
                IsTouch: false,
                TouchTime: ''
            };
            let alarmLevel = 0;
            let historyId = 0;
            //判断是否有触碰过电子标签
            this.checkEmarkTouch(emarkId).then((touch) => {
                Object.assign(touched, touch);
                // alarmLevel = this.alarmSvr.checkAlarm(node, obsIds.join(','));
                if (node.IsObs == 1) {
                    alarmLevel = this.alarmSvr.checkObsAlarm(node, obsIds.join(','));
                } else {
                    alarmLevel = this.alarmSvr.checkNumericAlarm(node, obsIds.join(','));
                }
                let hisData = [node.DBID, planId, node.NodeId, 0, 1, obsIds.join(','), obsNames.join(','), '', cTime, 0, touched.IsTouch ? 1 : 0, touched.TouchTime, 0, 0, 0, alarmLevel, 0, 0, 0, 0, 0, 0, 0, userId, userName, '', memo];
                //该测点在当前计划周期内是否已存在历史记录,存在则更新,否则插入新的记录
                this.historySvr.getHisByPlan(planId, node.NodeId, userId).then((res) => {
                    if (res > 0) {
                        this.historySvr.updatePatrol(res, 1, obsIds.join(','), obsNames.join(','), null, alarmLevel).then(() => {
                            historyId = res;
                            this.UpdateFinishedPoint(patrolId);
                            resolve(historyId);
                        })
                    } else {
                        this.historySvr.insertData(hisData).then((dataId) => {
                            historyId = dataId;
                            //插入 taskpatrol信息
                            let taskData = [node.DBID, planId, historyId, patrolId, node.PatrolNodeId, cTime, node.OrderNum, node.NodePath];
                            this.insertPatrolTask(taskData).then((taskId) => {
                                this.UpdateFinishedPoint(patrolId);
                                resolve(historyId);
                            }, (tserr) => {
                                reject(tserr);
                            });
                        }, (herr) => {
                            reject(herr);
                        });
                    }
                });

            }, (toucherr) => {
                reject(toucherr);
            });
        });
    }

    /**
     * 删除指定的巡检值
     * @param dataId 
     */
    deleteOnePatrolData(dataId: number): Promise<any> {
        return new Promise<any>((resolve, reject) => {

            this.getTaskByData(dataId).then((task) => {
                let patrolId = task ? task.LocalPatrolId : 0;
                this.historySvr.deleteData(dataId).then((res) => {
                    this.UpdateFinishedPoint(patrolId);
                    resolve(res);
                }, (err) => {
                    reject(err);
                });
            }, (terr) => {
                reject(terr);
            }).catch((err) => {
                reject(err);
            });
        });
    }

	/**
	 * 获取当前用户待回收的计划数据
	 * @param userId 
	 */
    getUnUploadPlan(userId: Number): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let sql = 'select * from T_LocalPatrol l where l.FinishedPoint>0 and exists(select 1 from T_PatrolData t, T_PatrolTask p where t.PatrolDataId = p.PatrolDataId and t.IsUpload=0 and t.Excutor=l.Executor and t.Excutor=? and l.PlanId = t.PlanId  and t.SampleTime>=l.StartTime and t.SampleTime<=l.EndTime)';
            this.db.execute(this.db.Ins, sql, [userId]).then((res) => {
                let list = this.helper.copyRows(res);
                for (let item of list) {
                    this.getNextPlanCnt(item.PlanId, userId).then((res) => {
                        item.Cyc = res;
                        item.checked = false;
                    })
                }
                resolve(list);
            }, (err) => {
                this.logSvr.log("get UnUploadPlanData failed", err, true)
                reject(err);
            }).catch((err) => {
                this.logSvr.log("get UnUploadPlanData failed", err, true)
                reject(err);
            })
        });
    }

    /**
     * 根据计划ID获取计划剩余巡检周期数
     * @param planId 
     * @param userId 
     */
    getNextPlanCnt(planId: Number, userId: Number): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let sql = 'select count(1) cnt from T_LocalPatrol where Executor=? and PlanId=? and StartTime>?';
            let cTime = this.helper.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
            this.db.execute(this.db.Ins, sql, [userId, planId, cTime]).then((res) => {
                let count = res.rows.item(0).cnt;
                resolve(count);
            }, (err) => {
                this.logSvr.log("get getNextPlanCnt failed", err, true)
                reject(err);
            }).catch((err) => {
                this.logSvr.log("get getNextPlanCnt failed", err, true)
                reject(err);
            });
        });
    }

    /**
     * 根据计划id删除本地未回收的巡检数据
     * @param localPatrolId 
     * @param userId 
     */
    deleteLocalPatrolDataById(localPatrolId: number, userId: number): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            //先删除巡检任务
            let sql1 = "delete from " + this.tbPatrolTask + " where PatrolDataId in (select PatrolDataId from T_PatrolData where IsUpload=0 and Excutor=? and exists(select 1 from T_LocalPatrol l where l.PlanId = T_PatrolData.PlanId and l.Executor=T_PatrolData.Excutor and T_PatrolData.SampleTime>=l.StartTime and T_PatrolData.SampleTime<=l.EndTime and l.LocalPatrolId=?))";
            //再删除巡检结果
            let sql2 = "delete from T_PatrolData where IsUpload=0 and Excutor=? and exists(select 1 from T_LocalPatrol l where l.PlanId = T_PatrolData.PlanId and l.Executor=T_PatrolData.Excutor and T_PatrolData.SampleTime>=l.StartTime and T_PatrolData.SampleTime<=l.EndTime and l.LocalPatrolId=?)";
            this.db.nestedExecute(this.db.Ins, sql1, sql2, [userId, localPatrolId], [userId, localPatrolId]).then((res) => {
                //更新巡检计划已完成测点数
                let sql3 = "update T_LocalPatrol set FinishedPoint=FinishedPoint-? where LocalPatrolId=?";
                this.db.execute(this.db.Ins, sql3, [res.rowsAffected, localPatrolId]);
                resolve(true);
            }, (err) => {
                this.logSvr.log("delete LocalPatrolData  failed", err, true)
                reject(err);
            }).catch((err) => {
                this.logSvr.log("delete LocalPatrolData failed", err, true)
                reject(err);
            })
        });
    }

    /**
     * 验证当前巡检数据是否未被回收
     * @param patrolDataId 
     */
    isUploadOrNot(patrolDataId: number): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let sql = `select * from T_PatrolData where PatrolDataId=? and IsUpload=0 `;
            this.db.execute(this.db.Ins, sql, [patrolDataId]).then((res) => {
                if (this.helper.copySingle(res)) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }, (err) => {
                this.logSvr.log("get patroldata isupload failed", err, true)
                reject(err);
            }).catch((err) => {
                this.logSvr.log("get patroldata isupload failed", err, true)
                reject(err);
            });
        });
    }
}