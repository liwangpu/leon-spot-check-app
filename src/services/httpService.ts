import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { X2JS } from '../common/xml2json';

@Injectable()
export class HttpService {

    constructor(private http: Http) {

    }

    /**
     * get请求,获取返回内容
     * @param url 请求的url
     * @param params 请求传递的参数
     */
    public get(url: string, params: any) {
        return this.http.get(url + '?' + this.toQueryString(params))
            .toPromise()
            .then(res => this.handlerSuccess(res.json()))
            .catch(error => this.handlerFailure(error));
    }

    /**
     * get 请求,获取xml内容
     * @param url 
     * @param params 
     */
    public getXml(url: string, params: any) {
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this.http.get(url + '?' + this.toQueryString(params), new RequestOptions({ headers: headers }))
            .toPromise()
            .then(res => this.handlerXml(res))
            .catch(error => this.handlerFailure(error));
    }

    /**
     * post请求,获取返回的json字符串,返回值必须为标准的json格式,否则无法解析
     * @param url 请求url
     * @param params 请求传递的参数对象
     */
    public postBody(url: string, params: any) {
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this.http.post(url, params, new RequestOptions({ headers: headers }))
            .toPromise()
            .then(res => this.handlerSuccess(res.json()))
            .catch(error => this.handlerFailure(error));
    }

    /**
     * post请求,获取返回的值的全部内容(必须是标准json字符串格式)
     * @param url 请求url
     * @param params 请求传递的参数对象
     */
    public post(url: string, params: any) {
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this.http.post(url, this.toQueryString(params), new RequestOptions({ headers: headers }))
            .toPromise()
            .then(res => this.handlerSuccess(res.json()))
            .catch(error => this.handlerFailure(error));
    }

    /**
     * http请求成功处理
     * @param response 请求响应值
     */
    private handlerSuccess(response) {
        return { success: true, msg: response.Msg, data: response };
    }

    /**
     * 处理xml,转换为json
     * @param response 
     */
    private handlerXml(response) {
        let rdata = new X2JS().xml_str2json(response._body);
        let result = new Array();
        result.push(rdata);
        return { success: true, msg: response.Msg, data: result };
    }

    /**
     * http请求失败处理
     * @param error 请求响应值
     */
    private handlerFailure(error: Response | any) {
        let msg = "请求失败";
        if (error.status == 0) {
            msg = "与服务器连接失败";
        }
        if (error.status == 400) {
            msg = "请求无效";
        }
        if (error.status == 404) {
            msg = "请求资源不存在";
        }
        if (error.status == 500) {
            msg = "请求超时";
        }
        return { success: false, msg: msg, data: [] };
    }

    /**
     * 将参数对象转换为请求query字符串
     * @param obj 参数对象
     */
    private toQueryString(obj) {
        let result = [];
        for (let key in obj) {
            key = encodeURIComponent(key);
            let values = obj[key];
            if (values && values.constructor == Array) {
                let queryValues = [];
                for (let i = 0, len = values.length, value; i < len; i++) {
                    value = values[i];
                    queryValues.push(this.toQueryPair(key, value))
                }
                result = result.concat(queryValues);
            } else {
                result.push(this.toQueryPair(key, values));
            }
        }
        return result.join('&');
    }

    /**
     * 将键值对转换为字符串
     * @param key
     * @param value
     */
    private toQueryPair(key, value) {
        if (typeof value == 'undefined') {
            return key;
        }
        return key + '=' + encodeURIComponent(value === null ? '' : String(value));
    }
}
