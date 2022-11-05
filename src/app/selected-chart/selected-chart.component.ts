import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { CoinGeckoService } from '../controller/coingecko.service';
import { ChartData } from '../model/ChartData';
import * as echarts from 'echarts';

@Component({
  selector: 'app-selected-chart',
  templateUrl: './selected-chart.component.html',
  styleUrls: ['./selected-chart.component.css']
})
export class SelectedChartComponent implements OnInit {
  chartTitle = '';
  chartOption: EChartsOption = {};

  constructor(private coinGeckoService: CoinGeckoService) { 
    this.coinGeckoService.getChartTitle().subscribe((coinName: string) => {
      this.chartTitle = coinName;
    })

    this.coinGeckoService.getChartData().subscribe((chartData: ChartData) => {
      if (chartData.prices === null) return;

      this.chartOption = {
        color: '#16C784',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        xAxis: {
          type: 'time',
        },
        yAxis: {
        },
        dataZoom: [
          {
            fillerColor: '#574CCB12',
            dataBackground: {
              areaStyle: {
                color: '#574CCB'
              },
              lineStyle: {
                color: '#574CCB'
              }
            }
          },
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
            name: 'Price',
            type: 'line',
            showSymbol: false,
            lineStyle: {
              color: '#16C784'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1.2, [
                {
                  offset: 0,
                  color: '#16C784'
                },
                {
                  offset: 1,
                  color: '#ffffff12'
                }
              ])
            },
            data: chartData.prices.map((data: any) => {
              data[1] >= 10 ? data[1] = Math.round(data[1] * 100) / 100 : data[1] = Math.round(data[1] * 1000000) / 1000000
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
