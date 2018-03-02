import { Injectable } from '@angular/core';
import { AppConfig } from '../../common/appConfig';
import { HttpService } from '../httpService';
@Injectable()
export class MachTreeAsyncService {

    constructor(private http: HttpService) {

    }

    public getAlarmStatus(userId: number | string) {
        var rest = '/PmsApi/MachTreeApi/GetAlarmStatus';
        let durl = `${AppConfig.getInstance().HMSServiceUrl}/${rest}`;
        let pdata = { iUser: userId };
        return this.http.post(durl, pdata);

    }
}