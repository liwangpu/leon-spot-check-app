import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import * as ECharts from 'echarts';
import { AdvsPage } from '../../../advs/advs';

@Component({
    selector: 'page-home-stat-area-status-adv',
    templateUrl: 'statusReport.html'
})
export class StatusReportAdv implements OnInit {

    linkUrl = AdvsPage;
    @ViewChild('statusChartContainer') chartContainer: ElementRef;
    constructor() {

    }

    ngOnInit(): void {
        let myChart = ECharts.init(this.chartContainer.nativeElement);

        let option = {
            title: {
                text: '设备状态趋势',
                x: 'center',
                // y: 'top',
                // textAlign: 'center'
            },
            // tooltip: {
            //     trigger: 'axis'
            // },
            legend: {
                data: ['预警', '警告', '报警', '危险'],
                top: '12%',
            },
            // grid: {
            //     left: '3%',
            //     right: '4%',
            //     bottom: '3%',
            //     containLabel: true
            // },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['1月份', '2月份', '3月份', '4月份', '5月份', '6月份', '7月份']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '预警',
                    type: 'line',
                    stack: '总量',
                    smooth: true,
                    data: [1, 3, 5, 2, 1, 2, 4]
                },
                {
                    name: '警告',
                    type: 'line',
                    stack: '总量',
                    smooth: true,
                    data: [2, 2, 1, 1, 6, 2, 3]
                },
                {
                    name: '报警',
                    type: 'line',
                    stack: '总量',
                    smooth: true,
                    data: [1, 0, 2, 5, 0, 8, 2]
                },
                {
                    name: '危险',
                    type: 'line',
                    stack: '总量',
                    smooth: true,
                    data: [1, 0, 1, 1, 0, 0, 1]
                }
            ]
        };


        myChart.setOption(option);
    }
}