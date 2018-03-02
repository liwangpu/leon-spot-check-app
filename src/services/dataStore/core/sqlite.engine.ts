import { DbEngine } from '../interfaces';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

export class SQLiteEngine implements DbEngine {

    private _db: SQLiteObject;//SQLite存储引擎
    private _bOpen: boolean;//数据是否为打开状态

    constructor(private strDbName: string, private strLocation = 'default') {
        this.strDbName = `${this.strDbName}.db`;
    }

    /**
 * 准备数据库实例
 * 如果已经初始化直接返回
 */
    private prepareDb(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this._bOpen) {
                resolve();
            }
            else {
                let sqlite = new SQLite();
                sqlite.create({
                    name: this.strDbName,
                    location: this.strLocation
                }).then((db: SQLiteObject) => {
                    this._db = db;
                    this._bOpen = true;
                    resolve();
                });
            }
        });
    }//prepareDb

    /**
     * 执行SQL语句,返回受影响的id
     * @param strSql 
     * @param values 
     */
    executeSqlBackId(strSql: string, values: any[]): Promise<number> {
        let prepareDbDefer = () => {
            return this.prepareDb();
        };

        let executeDefer = () => {
            return new Promise<number>((resolve, rejct) => {
                this._db.transaction((tx) => {
                    tx.executeSql(strSql, values, (tx, rdata) => {
                        resolve(rdata.insertId);
                    }, (error) => {
                        rejct(0);
                        return false;
                    });
                });
            });
        };

        return prepareDbDefer().then(executeDefer);
    }//executeSqlBackId

    /**
     * 执行SQL语句
     * @param strSql 
     * @param values 
     */
    executeSql(strSql: string, values: any[]): Promise<any[]> {
        let prepareDbDefer = () => {
            return this.prepareDb();
        };

        let executeDefer = () => {
            return new Promise<any[]>((resolve, reject) => {
                this._db.executeSql(strSql, values).then((rdata) => {
                    let arrs = [];
                    if (rdata.rows && rdata.rows.length) {
                        for (let idx = 0, len = rdata.rows.length; idx < len; idx++) {
                            arrs.push(Object.assign({}, rdata.rows.item(idx)));
                        }
                    }
                    resolve(arrs);
                }).catch(() => {
                    reject([]);
                });
            });
        };

        return prepareDbDefer().then(executeDefer);
    }//executeSql


}