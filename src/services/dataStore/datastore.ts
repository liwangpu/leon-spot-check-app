import { Entity, DbEngine, QueryFilter } from './interfaces';
import { DbStoreProvider } from './datastore.provider';
import { SQLTranslator } from './core/sqltranslator';
import { Injectable } from '@angular/core';

@Injectable()
export class DataStore {

    private _dbEngine: DbEngine;//数据存储引擎
    private _existTables: Array<string>;//已经建立的表
    private _translator: SQLTranslator;//SQL翻译器

    constructor(private dbProvider: DbStoreProvider) {
        this._existTables = [];
        this._dbEngine = this.dbProvider.createDbEngine();
        this._translator = new SQLTranslator();
    }

    /**
     * 校验表是否存在
     * 存在即返回,否则新建表
     * @param entity 实体信息
     */
    private checkTable(entity: Entity): Promise<void> {
        let tableName = `${entity.constructor.name}`;
        return new Promise<void>((resolve, reject) => {
            let bexist = this._existTables.indexOf(tableName) !== -1;
            if (bexist) {
                resolve();
            }
            else {
                let strSql = this._translator.createTableTrans(entity);
                this._dbEngine.executeSql(strSql, []).then(() => {
                    this._existTables.push(tableName);
                    resolve();
                }).catch((err) => {
                    reject();
                });
            }
        });
    }//checkTable


    /**
     * 简单保存或者编辑
     * @param entity 
     */
    public simpleSaveOrUpdate(entity: Entity): Promise<any> {

        let prepareTableDefer = () => {
            return this.checkTable(entity);
        };

        let createDataDefer = () => {
            return new Promise((resolve, reject) => {
                let gen = this._translator.createDataTrans(entity);
                this._dbEngine.executeSqlBackId(gen[0], gen[1]).then((rdata) => {
                    Object.assign(entity, { id: rdata });
                    resolve();
                }).catch((err) => {
                    reject(err);
                });
            });
        };

        let updateDataDefer = () => {
            return new Promise((resolve, reject) => {
                let gen = this._translator.updateDataTrans(entity);
                this._dbEngine.executeSql(gen[0], gen[1]).then((rdata) => {
                    resolve();
                }).catch((err) => {
                    reject(err);
                });
            });
        };


        let saveDataDefer = () => {
            if (entity.Id) {
                return updateDataDefer();
            }
            else {
                return createDataDefer();
            }
        };

        return prepareTableDefer().then(saveDataDefer);
    }

    /**
     * 简单删除
     * @param entity 
     */
    public simpleDelete(entity: Entity): Promise<any> {
        let prepareTableDefer = () => {
            return this.checkTable(entity);
        };

        let deleteDefer = () => {
            return new Promise<any>((resolve, reject) => {
                let strSql = this._translator.deleteDataTrans(entity);
                this._dbEngine.executeSql(strSql, []).then((rdata) => {
                    resolve();
                }).catch((err) => {
                    reject(err);
                });
            });
        };

        return prepareTableDefer().then(deleteDefer);
    }//simpleDelete


    /**
     * 查询数据
     * @param filters 
     * @param instance 
     */
    public query(filters: Array<QueryFilter>, instance: Entity): Promise<Array<any>> {
        let prepareTableDefer = () => {
            return this.checkTable(instance);
            // return Promise.resolve();
        };

        let queryDefer = () => {
            return new Promise<Array<any>>((resolve, reject) => {
                let gen = this._translator.queryDataTrans(filters, instance);
                this._dbEngine.executeSql(gen[0], gen[1]).then((rdata) => {
                    resolve(rdata);
                }).catch((err) => {
                    reject([]);
                });
            });
        };

        return prepareTableDefer().then(queryDefer);
    }//query


    /**
     * 删除表
     * @param instance 
     */
    public deleteTable(instance: Entity): Promise<any> {
        let tableName = `${instance.constructor.name}`;
        let idx = this._existTables.indexOf(tableName);
        if (idx !== -1) {
            this._existTables.splice(idx, 1);
        }

        return new Promise<any>((resolve, reject) => {
            let strSql = this._translator.dropTableTrans(instance);
            this._dbEngine.executeSql(strSql, []).then((rdata) => {
                resolve();
            }).catch((err) => {
                reject(err);
            });
        });
    }//deleteTable

    /**
     * 直接执行SQL语句
     * @param strSql 
     * @param values 
     */
    public executeSql(strSql: string, values: Array<any>): Promise<any[]> {
        return new Promise<any[]>((resolve, reject) => {
            return this._dbEngine.executeSql(strSql, values);
        });
    }//executeSql

}//DataStore