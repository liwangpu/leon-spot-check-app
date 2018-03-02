import { Component } from '@angular/core';
import { PlanPage } from './plan/plan';
import { StatPage } from './stat/stat';
import { StatusPage } from './status/status';
@Component({
    selector: 'page-patrol',
    templateUrl: './patrol.html'
})
export class PatrolPage {
    centerTab = PlanPage;
    statTab = StatPage;
    statusTab = StatusPage;
    constructor() {

    }
}