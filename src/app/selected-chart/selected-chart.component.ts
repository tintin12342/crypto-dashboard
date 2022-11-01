import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { CoinGeckoService } from '../controller/coingecko.service';
import { OHLC } from '../model/OHLC';

@Component({
  selector: 'app-selected-chart',
  templateUrl: './selected-chart.component.html',
  styleUrls: ['./selected-chart.component.css']
})
export class SelectedChartComponent implements OnInit {

  chartOption: EChartsOption = {};

  constructor(private coinGeckoService: CoinGeckoService) { 
    this.coinGeckoService.getOHLCData().subscribe((ohlcData: OHLC[]) => {
      if (ohlcData.length === 0) return;
      let chartData =this.splitData(ohlcData.map((ohlc: any) => {
        ohlc[0] = new Date(ohlc[0]).toISOString().replace("T"," ").substring(0, 16);
        return ohlc;
      }));

      this.chartOption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        grid: {
          left: '10%',
          right: '10%',
          bottom: '15%'
        },
        xAxis: {
          type: 'category',
          data: chartData.categoryData,
          boundaryGap: false,
          axisLine: { onZero: false },
          splitLine: { show: false },
          min: 'dataMin',
          max: 'dataMax'
        },
        yAxis: {
          scale: true,
          splitArea: {
            show: true
          }
        },
        series: [
          {
            type: 'candlestick',
            data: chartData.values,
            itemStyle: {
              color: '#16C784',
              color0: '#EA3943',
              borderColor: '#16C784',
              borderColor0: '#EA3943'
            },
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
