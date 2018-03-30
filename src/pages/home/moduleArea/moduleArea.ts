import { Component, Input } from '@angular/core';
import { PlanPage } from '../../patrol/plan/plan';
import { MessagePage } from '../../message/message';
import { EditModAreaPage } from '../editModArea/editModArea';

@Component({
    selector: 'page-home-module-area',
    templateUrl: 'moduleArea.html'
})
export class ModuleAreaPage {

    patrolMode = PlanPage;
    messageMode = MessagePage;
    editModAres = EditModAreaPage;

    @Input() MyModArr: Array<any> = [];
    constructor() {

    }

    getItemUrl(url) {
        if (url == "messageMode") {
            return this.messageMode;
        }else{
            return "";
        }
    }
}

