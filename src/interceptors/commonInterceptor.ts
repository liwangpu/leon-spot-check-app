import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
/**
 * 用于在http请求中添加一些基本信息
 * 比如content-type:application/json等Header信息
 */
@Injectable()
export class CommonInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        let secureHeaders = req.headers;

        let contentTypeHeader: any = req.headers.has('Content-Type') || req.headers.has('content-type');
        if (!contentTypeHeader) {
            secureHeaders = secureHeaders.append('Content-Type', 'application/json');

        }
        
        const secureReq = req.clone({ headers: secureHeaders });
        return next.handle(secureReq);
    }

}