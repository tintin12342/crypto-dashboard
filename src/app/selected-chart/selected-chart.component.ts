import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { CoinGeckoService } from '../controller/coingecko.service';
import { ChartData } from '../model/ChartData';

@Component({
  selector: 'app-selected-chart',
  templateUrl: './selected-chart.component.html',
  styleUrls: ['./selected-chart.component.css']
})
export class SelectedChartComponent implements OnInit {

  chartOption: EChartsOption = {};

  constructor(private coinGeckoService: CoinGeckoService) { 
    this.coinGeckoService.getChartData().subscribe((chartData: ChartData) => {
      if (chartData.prices === null) return;

      this.chartOption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        xAxis: {
          type: 'time',
          boundaryGap: false
        },
        yAxis: {
          type: 'value'
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100
          },
          {
            start: 0,
            end: 100
          }
        ],
        series: [
          {
            type: 'line',
            areaStyle: {},
            symbol: 'none',
            data: chartData.prices.map((data: any) => {
              data[1] = Math.round(data[1] * 100) / 100;
              return data
            })
          }
        ]
      }
    })
  }

  splitData(rawData: any) {
    const categoryData = [];
    const values = [];
    for (var i = 0; i < rawData.length; i++) {
      categoryData.push(rawData[i].splice(0, 1)[0]);
      values.push(rawData[i]);
    }
    return {
      categoryData: categoryData,
      values: values
    };
  }
  

  ngOnInit(): void {
  }

}
