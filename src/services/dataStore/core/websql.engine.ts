import { DbEngine } from '../interfaces';

export class WebSQLEngine implements DbEngine {

    private _db: Database;//数据库实例
    private _bOpen: boolean;//数据是否为打开状态

    constructor(private strDbName: string) { }

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
                this._db = window.openDatabase(this.strDbName, "1.0", "Cordova Demo", 4 * 1024 * 1024, () => {
                    this._bOpen = true;
                    resolve();
                });
                //用setTimeout弥补websql open已经建立的数据库没有回调
                setTimeout(() => {
                    this._bOpen = true;
                    resolve();
                }, 500);
            }
        });
    }//prepareDb

    /**
     * 执行SQL语句
     * @param strSql 
     * @param values 
     */
    executeSql(strSql: string, values: Array<any>): Promise<any[]> {
        let prepareDbDefer = () => {
            return this.prepareDb();
        };

        let executeDefer = () => {
            return new Promise<any[]>((resolve, rejct) => {
                this._db.transaction((tx) => {
                    tx.executeSql(strSql, values, (tx, rdata) => {
                        let arrs = [];
                        if (rdata.rows && rdata.rows.length) {
                            for (let idx = 0, len = rdata.rows.length; idx < len; idx++) {
                                arrs.push(Object.assign({}, rdata.rows.item(idx)));
                            }
                        }
                        resolve(arrs);
                    }, (error) => {
                        rejct([]);
                        return false;
                    });
                });
            });
        };

        return prepareDbDefer().then(executeDefer);
    }//executeSql

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
    }
}