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

  leftSelect: number = -1;
  rightSelect: number = -1;
  amount: Big = {} as Big;
  percent: string = '';
  
  allPrices: number[] = [];

  constructor(private coinGeckoService: CoinGeckoService) { 
    this.coinGeckoService.setChartData('bitcoin', '1');

    this.coinGeckoService.getChartTitle().subscribe((coinName: string) => {
      if (coinName === '') coinName = 'Bitcoin';
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
    this.changePeriod = $event.source.buttonToggleGroup.value;
    this.coinGeckoService.setChartData(this.coinId, this.changePeriod);
  }

  onSelectReset(params: any) {
    if (params.areas.length === 1) return;
    
    this.echarts.setOption<echarts.EChartsOption>({
      tooltip: {
        formatter: (params: any) => {
          if (Number(this.amount) <= 0) {
            return this.toolTipDesign(true, params, 'var(--red)');
          } else {
            return this.toolTipDesign(true, params, 'var(--green)');
          }
        },
      },
    });
  }

  onAreaSelect(params: any) {
    if (params.batch[0].areas.length === 0) return;
    this.leftSelect = this.allPrices[params.batch[0].areas[0].coordRanges[0][0]];
    this.rightSelect = this.allPrices[params.batch[0].areas[0].coordRanges[0][1]];
    this.amount = new Big(this.rightSelect).sub(this.leftSelect);
    this.percent = new Big((1 - Number(new Big(this.leftSelect).div(this.rightSelect))) * 100).toFixed(4);

    this.echarts.setOption<echarts.EChartsOption>({
      tooltip: {
        formatter: (params: any) => {
          if (Number(this.amount) <= 0) {
            return this.toolTipDesign(false, params, 'var(--red)');
          } else {
            return this.toolTipDesign(false, params, 'var(--green)');
          }
        },
      },
    });
  }

  toolTipDesign(originalDesign: boolean, params: any, color: string): string {
    if (originalDesign) {
    return `
    ${params[0].name}<br/>
    <div style="display: flex; justify-content: space-between;">
      <span>${params[0].marker} Price</span>
      <strong>${params[0].data}</strong>
    </div>
    `} else {

    return `
    <style>
      .space {
        display: flex;
        justify-content: space-between;
      }
      .marker {
        display:inline-block;
        margin-right:4px;
        border-radius:10px;
        width:10px;
        height:10px;
        background-color: ${color};
      }
    </style>
    ${params[0].name}<br/>
    <div class="space">
      <span><span class="marker"></span> Price</span>
      <strong>${params[0].data}</strong>
    </div>
    <hr style="border-color: ${color}">
    <div class="space">
      <span>Left</span>
      <span>Right</span>
    </div>
    <div class="space">
      <strong>${this.leftSelect}</strong>
      <strong>${this.rightSelect}</strong>
    </div>
    <div class="space">
      <span>Amount</span>
      <span>Percent</span>
    </div>
    <div class="space">
      <strong>${this.amount}</strong>
      <strong>${this.percent}</strong>
    </div>
    `}
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
      brush: {
        toolbox: ['lineX'],
        yAxisIndex: 0,
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
