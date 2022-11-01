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

  chartOption: EChartsOption = {
    
  };

  constructor(private coinGeckoService: CoinGeckoService) { 
    this.coinGeckoService.getOHLCData().subscribe((ohlcData: OHLC[]) => {
      if (ohlcData.length === 0) return;
    })
  }

  ngOnInit(): void {
  }

}
