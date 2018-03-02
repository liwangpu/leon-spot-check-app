// import { NgModule } from '@angular/core';
// import { IonicModule } from 'ionic-angular';
// import { InletSuite } from './inlet/inlet';
// @NgModule({
//     imports: [IonicModule],
//     declarations: [
//         InletSuite
//     ],
//     exports: [SuiteModule]
// })
// export class SuiteModule {

// }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';
import { InletSuite } from './inlet/inlet';
import { PageLink } from './link/pageLink';
@NgModule({
    imports: [
        CommonModule,
        IonicModule
    ],
    declarations: [
        InletSuite,
        PageLink
    ],
    exports: [
        InletSuite,
        PageLink
    ]
})
export class AppSuiteModule { }