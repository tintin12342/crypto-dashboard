import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { CoinGeckoService } from '../controller/coingecko.service';
import * as echarts from 'echarts';
import Big from 'big.js';
import { ChartData } from '../model/ChartData';

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
  
  maxPrice: Big = new Big(-1);
  minPrice: Big = new Big(-1);

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
        let price = new Big(element[1])
        element[1] >= 10 ? element[1] = Number(price.toFixed(2)) : element[1] = Number(price.toFixed(6))
        this.allPrices.push(element[1])

        this.maxPrice = new Big(Math.max.apply(Math, this.allPrices)).round(4, Big.roundUp)
        this.minPrice = new Big(Math.min.apply(Math, this.allPrices)).round(4, Big.roundDown)
      });

      this.setChartOptions(chartData)

      this.allPrices = [];
    })
  }

  ngOnInit(): void {
  }

  setChartOptions(chartData: any) {
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
        max: Number(this.maxPrice),
        min: Number(this.minPrice)
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
            let price = new Big(data[1])
            data[1] >= 10 ? data[1] = Number(price.toFixed(2)) : data[1] = Number(price.toFixed(6))
            return data
          })
        }
      ]
    }
  }

}
