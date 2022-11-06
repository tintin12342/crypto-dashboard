import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { CoinGeckoService } from '../controller/coingecko.service';
import * as echarts from 'echarts';

@Component({
  selector: 'app-selected-chart',
  templateUrl: './selected-chart.component.html',
  styleUrls: ['./selected-chart.component.css']
})
export class SelectedChartComponent implements OnInit {
  chartTitle = '';
  chartOption: EChartsOption = {};

  firstValue: number = -1;
  lastValue: number = -1;

  allPrices: number[] = []

  constructor(private coinGeckoService: CoinGeckoService) { 
    this.coinGeckoService.getChartTitle().subscribe((coinName: string) => {
      this.chartTitle = coinName;
    })

    this.coinGeckoService.getChartData().subscribe((chartData: any) => {
      if (chartData.prices === null) return;
      this.firstValue = chartData.prices[0][1];
      this.lastValue = chartData.prices[chartData.prices.length - 1][1];

      chartData.prices.forEach((element: number[]) => {
        element[1] >= 10 ? element[1] = Math.round(element[1] * 100) / 100 : element[1] = Math.round(element[1] * 1000000) / 1000000
        this.allPrices.push(element[1])
      });

      this.chartOption = {
        color: this.firstValue > this.lastValue ? '#EA3943' : '#16C784',
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
          max: Math.ceil(Math.max.apply(Math, this.allPrices) * 100000) / 100000,
          min: Math.floor(Math.min.apply(Math, this.allPrices) * 100000) / 100000,
        },
        grid: {
          top: '15%',
          left: '3%',
          right: '3%',
          bottom: '15%',
          containLabel: true
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
              color: this.firstValue > this.lastValue ? '#EA3943' : '#16C784'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: this.firstValue > this.lastValue ? '#EA3943' : '#16C784'
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

      this.allPrices = [];
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
