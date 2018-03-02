import { Component,OnInit, AfterViewChecked, AfterViewInit } from '@angular/core';
import { PlanPage } from '../../patrol/plan/plan';
import { MessagePage } from '../../message/message';

@Component({
    selector: 'page-home-module-area',
    templateUrl: 'moduleArea.html'
})
export class ModuleAreaPage implements OnInit,AfterViewChecked, AfterViewInit {

    ngAfterViewChecked(): void {
        // console.log(111,' module view ngAfterViewChecked');
    }
    ngAfterViewInit(): void {
        // throw new Error("Method not implemented.");
        // console.log(111,' module view inter');
    }
    ngOnInit(): void {
    //    console.log(111,' module view ngOnInit');
    }
    patrolMode = PlanPage;
    messageMode = MessagePage;
    constructor() {
        // console.log(111,' module view constructor');
    }

    // ngAfterViewChecked() {
    //     console.log(111,' module view inter');
    // }

    // ngOnDestroy() {
    //     console.log(111,' module view ngOnDestroy');
    // }
}

