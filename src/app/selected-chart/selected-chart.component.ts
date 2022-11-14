import { Component, OnInit } from '@angular/core';
import { ECharts, EChartsOption } from 'echarts';
import { CoinGeckoService } from '../controller/coingecko.service';
import * as echarts from 'echarts';
import Big from 'big.js';
import * as moment from 'moment';

@Component({
  selector: 'app-selected-chart',
  templateUrl: './selected-chart.component.html',
  styleUrls: ['./selected-chart.component.css']
})
export class SelectedChartComponent implements OnInit {
  echarts: ECharts = {} as ECharts;

  changePeriod: string = '1';
  chartTitle: string = '';
  coinId: string = '';
  color: string = 'var(--purple-light)';

  chartOption: EChartsOption = {};

  firstValue: number = -1;
  lastValue: number = -1;
  
  allPrices: number[] = [];

  constructor(private coinGeckoService: CoinGeckoService) { 
    this.coinGeckoService.setChartData('bitcoin', '1');

    this.coinGeckoService.getChartTitle().subscribe((coinName: string) => {
      if (coinName === '') coinName = 'Bitcoin';
      this.allPrices = [];
      this.chartTitle = coinName;
    });

    this.coinGeckoService.getCurrentCoinId().subscribe((coinId: string) => {
      this.coinId = coinId;
    });

    this.coinGeckoService.getChartData().subscribe((chartData: any) => {
      if (chartData.prices === null) return;
      if (chartData.prices.length > 275 && chartData.prices.length <= 290) this.changePeriod = '1';
      this.firstValue = chartData.prices[0][1];
      this.lastValue = chartData.prices[chartData.prices.length - 1][1];

      chartData.prices.forEach((element: number[]) => {
        let price = new Big(element[1]);
        element[1] >= 10 ? element[1] = Number(price.toFixed(2)) : element[1] = Number(price.toFixed(6));
        this.allPrices.push(element[1]);
      });

      this.setChartOptions(chartData);
    });
  }

  ngOnInit(): void {
  }

  onChartInit(echart: ECharts) {
    this.echarts = echart
  }

  onPeriodChange($event: any) {
    this.allPrices = [];
    this.coinGeckoService.resetAreaSelectData();
    this.changePeriod = $event.source.buttonToggleGroup.value;
    this.coinGeckoService.setChartData(this.coinId, this.changePeriod);
  }

  onSelectReset(params: any) {
    if (params.areas.length === 1) return;
    this.coinGeckoService.resetAreaSelectData();
  }

  onAreaSelect(params: any) {
    if (params.batch[0].areas.length === 0) return;
    this.coinGeckoService.setAreaSelectData(params, this.allPrices);
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
        type: 'category',
        data: chartData.prices.map((data: any) => {  
          let date =  moment(new Date(data[0]))
          const showDate = this.changePeriod === 'max' || this.changePeriod === '365' ? 
          date.format('D MMM YYYY') : date.format('D MMM YYYY, h:mm:ss A');
          return showDate;
        })
      },
      yAxis: {
        scale: true,
      },
      toolbox: {
        top: '3.5%',
        right: '26%',
        itemSize: 20,
        backgroundColor: '#574CCB12',
        textStyle: {
          color: '#574CCB',
          textBorderColor: '#574CCB',
          borderColor: '#574CCB',
          backgroundColor: 'red',
          shadowColor: 'red'
        },
        iconStyle: {
          borderColor: '#222222',
          borderWidth: 1,
        },
        feature: {
          brush: {
            title: {
              lineX: 'Select area'
            },
          }
        }
      },
      brush: {
        toolbox: ['lineX'],
        yAxisIndex: 0,
        brushStyle: {
          color: '#574CCB12',
          borderColor: '#574CCB12'
        }
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
            return data[1]
          })
        }
      ]
    }
  }

}
