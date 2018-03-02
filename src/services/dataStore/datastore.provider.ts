import { DbEngine } from './interfaces';
import { WebSQLEngine } from './core/websql.engine';
import { SQLiteEngine } from './core/sqlite.engine';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../common/appConfig';
import { dbName } from '../../common/constants';
@Injectable()
export class DbStoreProvider {

    constructor() {

    }

    public createDbEngine(): DbEngine {
        if (AppConfig.getInstance().isMobile) {
            return new SQLiteEngine(dbName);
        }
        else {
            return new WebSQLEngine(dbName);
        }
    }

}

