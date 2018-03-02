import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import * as ECharts from 'echarts';
import { AdvsPage } from '../../../advs/advs';

@Component({
    selector: 'page-home-stat-area-arrival-adv',
    templateUrl: 'arrivalRate.html'
})
export class ArrivalRateAdv implements OnInit {

    linkUrl = AdvsPage;
    @ViewChild('arrivalChartContainer') chartContainer: ElementRef;

    constructor() {

    }

    ngOnInit(): void {
   let myChart = ECharts.init(this.chartContainer.nativeElement);

        let option = {
            color: ['#3398DB'],
            title:{
                text:'点检到位率',
                x:'center'
            },
            xAxis : [
                {
                    type : 'category',
                    data : ['1月份', '2月份', '3月份', '4月份', '5月份', '6月份', '7月份'],
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'直接访问',
                    type:'bar',
                    barWidth: '60%',
                    data:[93, 52, 80, 77, 54, 99, 98]
                }
            ]
        };


        myChart.setOption(option);
    }
}