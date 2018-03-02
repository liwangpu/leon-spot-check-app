import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite'
import { AppConfig } from '../../common/appConfig';

import { WebSql } from './websql'
import { dbName } from '../../common/constants';

@Injectable()
export class DataBase {
	public Ins: any;
	private sqlite: SQLite;
	private webdb: WebSql;
	constructor() {
		this.sqlite = new SQLite();
		this.webdb = new WebSql();
		this.Ins = false;
		this.initDb();
	}

	/***初始化数据库 */
	initDb() {
		if (!this.Ins) {
			let isMobile = AppConfig.getInstance().isMobile;
			this.openDB(null, isMobile);
		}
	}

	/**
	 * 打开／创建数据库
	 * @param options 
	 * @param isMobile 是否时移动端设备
	 */
	openDB(options: any, isMobile: boolean): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			/* here like a factory ,if websql or sqlite object ,then ,they have the save method */
			if (!isMobile) {
				this.Ins = this.webdb.openDatabase(dbName);
				if (this.Ins) {
					console.log('db has opened');
					resolve(this.Ins);
				} else {
					reject('open db error');
				}
			}
			else {
				this.sqlite.create({ name: dbName, location: 'default' }).then((db: SQLiteObject) => {
					this.Ins = db;
					console.log('db has opened');
					resolve(this.Ins);
				}, (err) => {
					reject(err);
				});
			}
		})

	}

    /* 以下各方法中，无所谓db具体是什么，只需要websql、sqlite插件实现了相同的方法，
    此次db并非指向SQLite、SQLiteObject，而是Websqldb或者SqliteObject._objectInstance  */
	execute(db: any, query: string, binding: any): Promise<any> {
		return new Promise((resolve, reject) => {
			db.transaction((tx) => {
				tx.executeSql(query, binding, function (tx, result) {
					return resolve(result);
				},
					function (transaction, error) {
						return reject(error);
					});
			}, (terr) => {
				console.log(terr);
			});
		});
	}

	insertCollection(db: any, query: string, bindings: any): Promise<any> {
		return new Promise((resolve, reject) => {
			var coll = bindings.slice(0); // clone collection 
			db.transaction((tx) => {
				(function insertOne() {
					var record = coll.splice(0, 1)[0]; // get the first record of coll and reduce coll by one
					try {
						tx.executeSql(query, record, function (tx, result) {
							if (coll.length === 0) {
								return resolve(result);
							} else {
								return insertOne();
							}
						}, function (transaction, error) {
							return reject(error);
						});
					} catch (exception) {
						return reject(exception);
					}
				})();
			});
		});
	}

	nestedExecute(db: any, query1: string, query2: string, binding1: any, binding2: any): Promise<any> {
		return new Promise((resolve, reject) => {
			db.transaction(function (tx) {
				tx.executeSql(query1, binding1, function (tx, result) {
					resolve(result);
					tx.executeSql(query2, binding2, function (tx, res) {
						return resolve(res);
					});
				});
			},
				function (transaction, error) {
					return reject(error);
				});
		});
	}

	/**
	 * 删除数据库
	 * @param dbName 
	 * @param isWeb 
	 */
	deleteDB(dbName: string, isWeb: boolean): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			if (isWeb) {
				resolve('ok');
			} else {
				//只有在移动端下才能删除数据库
				this.sqlite.deleteDatabase({ name: dbName, location: 'default' }).then(() => {
					this.Ins = false;
					resolve('database has been deleted');
				}, (err) => {
					reject(err);
				})
			}
		})
	}
}