import { Injectable, Inject, forwardRef } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { DataBase } from '../services';
import { LoggerSvr } from '../loggerSvr';
import { CommonHelper } from '../../common/commonHelper';

@Injectable()
export class HistorySvr {
	tbPatrolData: string;
	tbPatrolTask: string;
	helper: CommonHelper
	/**
	 * 自定义provider之间相互调用的依赖注入问题，会导致初始化时提示“Can't resolve all parameters for HistorySvr(undefined)
	 * 在重新构造实例时需遵循以下格式，具体原因还有待进一步研究
	 */
	constructor(@Inject(forwardRef(() => DataBase)) private db: DataBase,
		private logSvr: LoggerSvr
	) {
		this.helper = CommonHelper.getInstance();
		this.tbPatrolData = 'T_PatrolData';
		this.tbPatrolTask = 'T_PatrolTask';
		if (this.db.Ins)
			this.initTd();
	}

	/**
	 * 初始化数据表
	 * make sure tables are exists
	 */
	private initTd() {
		let sqltb = '	CREATE TABLE IF NOT EXISTS  T_PatrolData( PatrolDataId integer primary key ,DBID text ,PlanId integer  NOT NULL ,NodeId integer  NOT NULL ,MeasValue  float  NOT NULL ,IsObs  integer  NOT NULL ,ObsId text,ObsName  text ' + ' ,Abbr text,SampleTime text,Accuracy integer  NOT NULL ,IsTouched integer  NOT NULL ,	TouchTime text,	SampleFreq integer  NOT NULL ,Rev integer  NOT NULL ,DataLen integer  NOT NULL ,CurAlarm integer  NOT NULL ' + ' ,RMS float  NOT NULL ,Peak float  NOT NULL ,	PPeak float  NOT NULL ,	TPeak float  NOT NULL ,	TPPeak float  NOT NULL ,IsUpload integer  NOT NULL ,WaveEnable integer  NOT NULL ,Excutor integer  NOT NULL ' + ' ,ExcutorName  text,WaveFile text ,Memo text  ) ';
		let sqlTask = 'CREATE TABLE IF NOT EXISTS T_PatrolTask ( PatrolTaskId integer primary key ,	DBID text, PlanId integer, PatrolDataId integer ,LocalPatrolId integer ,ExecTime text ,OrderNum integer  NOT NULL ,PatrolNodeId integer  NOT NULL,NodePath text )  ';

		//执行事务，依次创建两张表
		this.db.nestedExecute(this.db.Ins, sqltb, sqlTask, [], []).then((res) => {
			this.logSvr.log(" make sure T_PatrolData tbPatrolTask/by history exists success ", res);
		}).catch((err) => {
			this.logSvr.log(" make sure T_PatrolData tbPatrolTask/by history exists faild ", err, true);
		});

	}

	/**
	 * 插入巡检数据，共27个字段，顺序
	 * DBID ,PlanId ,NodeId ,MeasValue ,IsObs ,ObsId,ObsName,Abbr ,SampleTime ,Accuracy ,IsTouched ,TouchTime ,SampleFreq ,Rev
	 * ,DataLen,CurAlarm ,RMS ,Peak ,PPeak ,TPeak ,TPPeak ,IsUpload ,WaveEnable ,Excutor ,ExcutorName,WaveFile ,Memo
	 * @param arrData 巡检数据数组
	 */
	insertData(arrData: Array<any>): Promise<any> {
		if (!arrData || arrData.length <= 0) {
			//记录日志
			this.logSvr.log('insert PatrolData 参数错误', '', true);
			return new Promise<any>((resolve, reject) => {
				reject("insert PatrolData 参数错误");
			});
		}

		let sql = 'insert into ' + this.tbPatrolData + ' (DBID ,PlanId ,NodeId ,MeasValue ,IsObs ,ObsId,ObsName,Abbr ,SampleTime ,Accuracy ,IsTouched ,TouchTime ,SampleFreq ,Rev ' + ' ,DataLen,CurAlarm ,RMS ,Peak ,PPeak ,TPeak ,TPPeak ,IsUpload ,WaveEnable ,Excutor ,ExcutorName,WaveFile ,Memo  ) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ';

		return new Promise<any>((resolve, reject) => {
			this.db.execute(this.db.Ins, sql, arrData)
				.then((res) => {
					//记录日志
					this.logSvr.log('insert Patrol Data success:', res);
					//返回插入数据的id，否则返回无效id 0
					resolve(res.rowsAffected ? res.insertId : 0);
				}, (err) => {
					//记录日志
					this.logSvr.log("insert Patrol Data faild:", err, true);
					reject(err);
				}).catch((err) => {
					//记录日志
					this.logSvr.log("insert Patrol Data faild:", err, true);
					reject(err);
				});
		})
	}

	/**
	 * 获取测点在当前计划执行周期内的历史数据(没有回收的),返回主键ID,没有则返回0
	 * @param planId 
	 * @param nodeId 
	 * @param userId 
	 */
	getHisByPlan(planId: number, nodeId: number, userId: number): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			let cTime = this.helper.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
			let sql = `select t.PatrolDataId from ${this.tbPatrolData} t, T_LocalPatrol l where l.StartTime<=? and l.EndTime>? and t.SampleTime>=l.StartTime and t.SampleTime<=l.EndTime and l.Executor=t.Excutor and t.Excutor=? and l.PlanId = t.PlanId and t.PlanId=? and t.NodeId=? and t.IsUpload=0`;
			this.db.execute(this.db.Ins, sql, [cTime, cTime, userId, planId, nodeId]).then((res) => {
				let rdata = this.helper.copySingle(res);
				if (rdata) {
					resolve(rdata.PatrolDataId);
				} else {
					resolve(0);
				}
			}, (err) => {
				this.logSvr.log("get his data faild:", err, true);
				reject(err);
			})
		});
	}

	/**
	 * 更新巡检结果,覆盖已有记录的测量值
	 * @param patrolDataId 
	 * @param isObs 
	 * @param obsId 
	 * @param obsName 
	 * @param measValue 
	 */
	updatePatrol(patrolDataId: number, isObs: number, obsId, obsName: string, measValue: string, alarmLevel): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			let sql = `update ${this.tbPatrolData} set obsId=?, obsName=?, SampleTime=?, CurAlarm=? where PatrolDataId=?`;
			let cTime = this.helper.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
			let vbinds = [obsId, obsName, cTime, alarmLevel, patrolDataId];
			if (isObs == 0) {
				sql = `update ${this.tbPatrolData} set measValue=?, SampleTime=?, CurAlarm=? where PatrolDataId=?`;
				vbinds = [measValue, cTime, alarmLevel, patrolDataId];
			}
			this.db.execute(this.db.Ins, sql, vbinds).then((res) => {
				resolve(res);
			}, (err) => {
				this.logSvr.log("updatePatrol data faild:", err, true);
				reject(err);
			});
		});
	}

	/**
	 * 删除巡检数据，并视情况删除执行记录（task)
	 * @param dataId 巡检数据id
	 */
	deleteData(dataId: number): Promise<any> {

		return new Promise<any>((resolve, reject) => {

			let sql = 'delete from ' + this.tbPatrolData + ' where PatrolDataId=' + dataId;
			let sqlTask = 'delete from ' + this.tbPatrolTask + ' where PatrolDataId= ' + dataId;

			this.getByDataId(dataId).then((data) => {
				if (data.IsUpload) {
					this.db.execute(this.db.Ins, sql, []).then((res) => {
						this.logSvr.log('delete patrol Data success ', res);
						resolve(res.rowsAffected);
					}, (err) => {
						this.logSvr.log('delete patrol Data faild ', err, true);
						reject(err);
					}).catch((err) => {
						this.logSvr.log('delete patrol Data faild ', err);
						reject(err);
					});
				} else {
					//执行sql事务，依次删除巡检数据，巡检计划记录
					this.db.nestedExecute(this.db.Ins, sql, sqlTask, [], []).then((res) => {
						this.logSvr.log('delete patrol Data success ', res);
						resolve(res);
					}).catch((err) => {
						this.logSvr.log('delete patrol Data faild ', err, true);
						reject(err);
					});
				}
			});
		});
	}

	/**
	 * 根据数据值获取数据
	 * @param dataId 
	 */
	getByDataId(dataId: number): Promise<any> {
		let sql = 'select *  from ' + this.tbPatrolData + ' where PatrolDataId=? ';
		return new Promise<any>((resolve, reject) => {
			this.db.execute(this.db.Ins, sql, [dataId]).then((res) => {
				this.logSvr.log('PatrolData getByDataId success ', res);
				let item = this.helper.copySingle(res);
				resolve(item);
			}, (err) => {
				this.logSvr.log('PatrolData getByDataId faild ', err, true);
				reject(err);
			}).catch((err) => {
				reject(err);
			});
		});
	}

	/**
	 * 删除计划的历次巡检数据
	 * @param dbId DBID
	 * @param planId 巡检计划id
	 * @param userId 执行用户ID
	 */
	deletePlanHistory(dbId: string, planId: number, userId: number): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			let sql = 'delete from ' + this.tbPatrolData + ' where DBID=? and PlanId=? and Excutor=?';
			this.db.execute(this.db.Ins, sql, [dbId, planId, userId]).then((res) => {
				this.logSvr.log('delete plan history  Data success ', res);
				resolve(res.rowsAffected);
			}, (err) => {
				this.logSvr.log('delete  plan history Data faild ', err, true);
				reject(err);
			}).catch((err) => {
				this.logSvr.log('delete  plan history Data faild ', err, true);
				reject(err);
			});
		});
	}

	/**
	 * 删除所有巡检计划
	 * @param userId 执行用户ID
	 */
	clearData(userId: number): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			let sql = 'delete from ' + this.tbPatrolData + ' where Excutor=?';
			this.db.execute(this.db.Ins, sql, [userId]).then((res) => {
				this.logSvr.log('clear patrol  Data success ', res);
				resolve(res.rowsAffected);
			}, (err) => {
				this.logSvr.log('clear  patrol  Data faild ', err, true);
				reject(err);
			}).catch((err) => {
				this.logSvr.log('clear  patrol  Data faild ', err, true);
				reject(err);
			});
		});
	}

	/**
	 * 更新指定的数值型的巡检数据
	 * @param dataId 
	 * @param measValue 
	 * @param accuracy 
	 * @param sampleTime 
	 * @param alarm 
	 * @param userId 
	 * @param userName 
	 * @param memo 
	 */
	updateNumericData(dataId: number, measValue: number, accuracy: number, sampleTime: string, alarm: number, userId: number, userName: string, memo: string): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			let sqldata = 'update T_PatrolData set MeasValue=? , Accuracy=? ,SampleTime=? , CurAlarm=?,Excutor=? ,ExcutorName=? ,Memo=? where PatrolDataId=? ';
			let sqlTask = 'update T_PatrolTask set ExecTime=? where PatrolDataId=? ';
			let dbind = [measValue, accuracy, sampleTime, alarm, userId, userName, memo, dataId];
			let tbind = [sampleTime, dataId];
			//执行事务，更新巡检数据和巡检任务记录
			this.db.nestedExecute(this.db.Ins, sqldata, sqlTask, dbind, tbind).then((res) => {
				this.logSvr.log('updateNumericData success ', res);
				resolve(res.rowsAffected);
			}, (err) => {
				this.logSvr.log('updateNumericData faild ', err, true);
				reject(err);
			}).catch((err) => {
				this.logSvr.log('updateNumericData faild ', err, true);
				reject(err);
			});
		});
	}

	/**
	 * 获取指定时间范围内的报警数据
	 * @param start 起始时间
	 * @param end 截止时间
	 * @param userId 用户id
	 */
	getAlarmData(start: string, end: string, userId: number): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			let sql = 'select *  from ' + this.tbPatrolData + ' where SampleTime>=? and SampleTime <=? and Excutor=? ';
			this.db.execute(this.db.Ins, sql, [start, end, userId]).then((res) => {
				this.logSvr.log('getAlarmData success ', res);
				let list = this.helper.copyRows(res);
				resolve(list);
			}, (err) => {
				reject(err);
			}).catch((err) => {
				this.logSvr.log('getAlarmData faild ', err, true);
				reject(err);
			});
		});
	}

	/**
	 * 获取指定的巡检中，状态报警的数据量
	 * @param arrPatrolId 巡检数据id数组: Array<number>
	 */
	getPatrolAlarmDataCnt(arrPatrolId: Array<number>): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			if (arrPatrolId && arrPatrolId.length) {
				let sql = 'select count(*) as cnt from ' + this.tbPatrolData + ' d , ' + this.tbPatrolTask + ' t  where d.PatrolDataId = t.PatrolDataId and t.LocalPatrolId in (' + arrPatrolId.join(',') + ') and CurAlarm>0 ';
				this.db.execute(this.db.Ins, sql, []).then((res) => {
					this.logSvr.log('getPatrolAlarmDataCnt success ', res);
					resolve(res.rows.item(0).cnt);
				}, (err) => {
					this.logSvr.log('getPatrolAlarmDataCnt faild ', err, true);
					reject(err);
				}).catch((err) => {
					this.logSvr.log('getPatrolAlarmDataCnt faild ', err, true);
					reject(err);
				});
			} else {
				resolve(0);
			}
		});
	}

	/**
	 * 获取指定的巡检中，状态报警的数据
	 * @param arrPatrolId 巡检数据id数组: Array<number>
	 */
	getPatrolAlarmData(arrPatrolId: Array<number>): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			if (arrPatrolId && arrPatrolId.length) {
				let sql = 'select d.* from ' + this.tbPatrolData + ' d , ' + this.tbPatrolTask + ' t  where d.PatrolDataId = t.PatrolDataId and t.LocalPatrolId in (' + arrPatrolId.join(',') + ') and CurAlarm>0 ';
				this.db.execute(this.db.Ins, sql, []).then((res) => {
					this.logSvr.log('getPatrolAlarmData success ', res);
					let list = this.helper.copyRows(res);
					resolve(list);
				}, (err) => {
					this.logSvr.log('getPatrolAlarmData faild ', err, true);
					reject(err);
				}).catch((err) => {
					this.logSvr.log('getPatrolAlarmData faild ', err, true);
					reject(err);
				});
			} else {
				resolve([]);
			}
		});
	}

	/**
	 * 获取待回收的数据总数
	 * @param userId 用户id
	 */
	getWaitReceiveCnt(userId: number, localPatrolId?: number): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			let sql = `select count(l.LocalPatrolId) as cnt from T_LocalPatrol l where l.FinishedPoint>0 and exists(select 1 from T_PatrolData t, T_PatrolTask p where p.PatrolDataId=t.PatrolDataId and t.IsUpload=0 and t.Excutor=l.Executor and t.Excutor=? and l.PlanId = t.PlanId  and t.SampleTime>=l.StartTime and t.SampleTime<=l.EndTime)`
			if (localPatrolId > 0) {
				sql += ` and l.LocalPatrolId=${localPatrolId}`;
			}
			this.db.execute(this.db.Ins, sql, [userId]).then((res) => {
				this.logSvr.log('getWaitReciveCnt success ', res);
				resolve(res.rows.item(0).cnt);
			}, (err) => {
				this.logSvr.log('getWaitReciveCnt faild ', err, true);
				reject(err);
			}).catch((err) => {
				this.logSvr.log('getWaitReciveCnt faild ', err, true);
				reject(err);
			});
		})
	}

	/**
	 * 获取待回收的数据
	 * @param userId 用户id
	 */
	getWaitReceive(userId: number): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			let sql = 'select * from ' + this.tbPatrolData + ' where IsUpload=0 and Excutor=? ';
			this.db.execute(this.db.Ins, sql, [userId]).then((res) => {
				this.logSvr.log('getWaitRecive success ', res);
				let list = this.helper.copyRows(res);
				resolve(list);
			}, (err) => {
				this.logSvr.log('getWaitRecive faild ', err, true);
				reject(err);
			}).catch((err) => {
				this.logSvr.log('getWaitRecive faild ', err, true);
				reject(err);
			});
		});
	}

	/**
	 * 获取电子标签未触碰的数据总数
	 * @param start 起始时间
	 * @param end 结束时间
	 * @param userId 用户ID
	 */
	getNotTouchCnt(start: string, end: string, userId: number): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			let sql = 'select count(*) as cnt from ' + this.tbPatrolData + ' where IsTouched=0 and Excutor=? and SampleTime>=? and SampleTime <=? ';
			this.db.execute(this.db.Ins, sql, [userId, start, end]).then((res) => {
				this.logSvr.log('getNotTouchCnt success ', res);
				resolve(res.rowsAffected.item(0).cnt);
			}, (err) => {
				this.logSvr.log('getNotTouchCnt faild ', err, true);
				reject(err);
			}).then((err) => {
				this.logSvr.log('getNotTouchCnt faild ', err, true);
				reject(err);
			});
		});
	}

	/**
	 * 获取电子标签未触碰的数据
	 * @param start 起始时间
	 * @param end 结束时间
	 * @param userId 用户ID
	 */
	getNotTouch(start: string, end: string, userId: number): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			let sql = 'select * from ' + this.tbPatrolData + ' where IsTouched=0 and Excutor=? and SampleTime>=? and SampleTime <=? ';
			this.db.execute(this.db.Ins, sql, [userId, start, end]).then((res) => {
				this.logSvr.log('getNotTouch success ', res);
				let list = this.helper.copyRows(res);
				resolve(list);
			}, (err) => {
				this.logSvr.log('getNotTouch faild ', err, true);
				reject(err);
			}).catch((err) => {
				this.logSvr.log('getNotTouch faild ', err, true);
				reject(err);
			});
		});
	}

	/**
	 * 获取电子标签未触碰的巡检数据总数
	 * @param arrPatrolId 巡检数据id数组: Array<number>
	 */
	getPatrolNotTouchCnt(arrPatrolId: Array<number>): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			if (arrPatrolId && arrPatrolId.length) {
				let sql = 'select count(*) as cnt from ' + this.tbPatrolData + ' d , ' + this.tbPatrolTask + ' t  where d.PatrolDataId = t.PatrolDataId and t.LocalPatrolId in (' + arrPatrolId.join(',') + ') and IsTouched=0 ';
				this.db.execute(this.db.Ins, sql, []).then((res) => {
					this.logSvr.log('getNotTouchCnt success ', res);
					resolve(res.rows.item(0).cnt);
				}, (err) => {
					this.logSvr.log('getNotTouchCnt faild ', err, true);
					reject(err);
				}).catch((err) => {
					this.logSvr.log('getNotTouchCnt faild ', err, true);
					reject(err);
				});
			} else {
				resolve(0);
			}
		});
	}

	/**
	 * 获取电子标签未触碰的巡检数据
	 * @param arrPatrolId 巡检数据id数组: Array<number>
	 */
	getPatrolNotTouch(arrPatrolId: Array<number>): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			if (arrPatrolId && arrPatrolId.length) {
				let sql = 'select d.* from ' + this.tbPatrolData + ' d , ' + this.tbPatrolTask + ' t  where d.PatrolDataId = t.PatrolDataId and t.LocalPatrolId in (' + arrPatrolId.join(',') + ') and IsTouched=0 ';
				this.db.execute(this.db.Ins, sql, []).then((res) => {
					this.logSvr.log('getNotTouchCnt success ', res);
					let list = this.helper.copyRows(res);
					resolve(list);
				}, (err) => {
					this.logSvr.log('getNotTouchCnt faild ', err, true);
					reject(err);
				}).catch((err) => {
					this.logSvr.log('getNotTouchCnt faild ', err, true);
					reject(err);
				});
			} else {

			}
		});
	}

	/**
	 * 获取测点最近n次的采集数据
	 * @param nodeId 测点ID
	 * @param DBID 
	 * @param len 
	 * @param userId 
	 */
	getLastedData(nodeId: number, DBID: string, len: number, userId: number): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			let sql = 'select * from ' + this.tbPatrolData + ' where NodeId=? and DBID=? and Excutor=? order by SampleTime desc limit 0,? ';
			this.db.execute(this.db.Ins, sql, [nodeId, DBID, userId, len]).then((res) => {
				this.logSvr.log('getLastedData success ', res);
				let list = this.helper.copyRows(res);
				resolve(list);
			}, (err) => {
				this.logSvr.log('getLastedData faild ', err, true);
				reject(err);
			}).catch((err) => {
				this.logSvr.log('getLastedData faild ', err, true);
				reject(err);
			});
		});
	}

	/**
	 * 点巡检数据查询方法
	 * 获取巡检计划中的设备节点，每页15条记录， curpage from 0
	 * @param dbId 巡检数据ID
	 * @param isUpload 是否已同步至服务器 0 or 1
	 * @param isObs 是否为设备节点 0 or 1
	 * @param hasWave 是否包含波形 0 or 1
	 * @param alarms 报警等级的字符串 [0, 1, 2......Í]
	 * @param desc 是否为降序排列 true or false
	 * @param nPage 当前页码，最小值为0
	 * @param pageSize 每页的记录数，default 15
	 */
	getDataPaging(dbId, isUpload, isObs, hasWave, alarms, desc, nPage, pageSize): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			let psize = pageSize ? pageSize : 15;
			let total = 0;
			let binds = [dbId];
			let sqlfrom = ' from ' + this.tbPatrolData + ' where dbId=? ';
			if (isUpload >= 0) {
				sqlfrom += ' and IsUpload=? ';
				binds.push(isUpload);
			}
			if (isObs >= 0) {
				sqlfrom += ' and IsObs=? ';
				binds.push(isObs);
			}
			if (hasWave >= 0) {
				sqlfrom += ' and WaveEnable=? ';
				binds.push(hasWave);
			}
			if (alarms) {
				sqlfrom += ' and CurAlarm in (' + alarms + ') ';
			}
			let sqlCnt = 'select count(*) as cnt ' + sqlfrom;
			let sql = 'select * ' + sqlfrom;
			if (desc) {
				sql += ' order by SamleTime desc limit ?,? ';
			} else {
				sql += ' order by SamleTime  limit ?,? ';
			}

			this.db.execute(this.db.Ins, sqlCnt, binds).then((res) => {
				total = res.rows.item(0).cnt;
				binds.push(nPage * psize, psize);
				this.db.execute(this.db.Ins, sql, binds).then((res1) => {
					this.logSvr.log('getDataPaging success', res1);
					let list = this.helper.copyRows(res1);
					resolve({
						total: total,
						data: list
					});
				}, (err1) => {
					this.logSvr.log('getDataPaging faild', err1, true);
					reject(err1);
				}).catch((err1) => {
					this.logSvr.log('getDataPaging faild', err1, true);
					reject(err1);
				})
			}).catch((err) => {
				reject(err);
			});
		});
	}

	/**
	 * 获取当前可回收的数据
	 * @param dbId 
	 * @param idstart 起始ID
	 * @param len 回收的数据总数，default 15
	 */
	getUnUpload(dbId: string, idstart: number, len: number): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			let psize = len ? len : 15;
			let binds = [];
			binds = [idstart, len];
			let sql = 'select * from ' + this.tbPatrolData + ' where PatrolDataId<? order by PatrolDataId desc limit 0,?';
			if (dbId != '') {
				binds = [dbId, idstart, psize];
				sql = 'select * from ' + this.tbPatrolData + ' where  DBID=? and   PatrolDataId<=? order by PatrolDataId desc limit 0,?';
			}
			this.db.execute(this.db.Ins, sql, binds).then((res) => {
				this.logSvr.log('getUnUpload success', res);
				let list = this.helper.copyRows(res);
				resolve(list);
			}, (err) => {
				this.logSvr.log('getUnUpload faild', err, true);
				reject(err);
			}).catch((err) => {
				this.logSvr.log('getUnUpload faild', err, true);
				reject(err);
			})
		});
	}

	/**
	 * 根据计划ID获取可待回收的数据
	 * @param planIds 
	 * @param userId 
	 */
	getUnUploadByIds(planIds: Array<any>, userId: Number): Promise<any> {
		return new Promise<any>((resolve, reject) => {

			let sql = "select t.* from " + this.tbPatrolData + " t, T_LocalPatrol l where t.IsUpload=0 and t.Excutor=? and l.PlanId = t.PlanId and l.Executor=t.Excutor and t.SampleTime>=l.StartTime and t.SampleTime<=l.EndTime and l.LocalPatrolId in (" + planIds.join(',') + ")";
			this.db.execute(this.db.Ins, sql, [userId]).then((res) => {
				let list = this.helper.copyRows(res);
				resolve(list);
			}, (err) => {
				this.logSvr.log('getUnUploadByIds faild', err, true);
				reject(err);
			}).catch((err) => {
				this.logSvr.log('getUnUploadByIds faild', err, true);
				reject(err);
			});
		});
	}

	/**
	 * 更新数据状态为“已同步至服务器”
	 * set IsUpload = 1
	 * @param dataIds 数据id Array<number>
	 */
	setAsUploaded(dataIds: Array<number>): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			if (dataIds && dataIds.length > 0) {
				let sql = ' update ' + this.tbPatrolData + ' set IsUpload=1 where PatrolDataId in ( ' + dataIds.join(',') + ' ) ';
				this.db.execute(this.db.Ins, sql, []).then((res) => {
					this.logSvr.log('setAsUploaded success', res);
					resolve(true);
				}, (err) => {
					this.logSvr.log('setAsUploaded faild', err, true);
					reject(err);
				}).catch((err) => {
					this.logSvr.log('setAsUploaded faild', err, true);
					reject(err);
				});
			} else {
				resolve(true);
			}
		});
	}

}