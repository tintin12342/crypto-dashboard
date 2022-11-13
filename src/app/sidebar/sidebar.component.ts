import { Component, OnInit } from '@angular/core';
import Big from 'big.js';
import * as moment from 'moment';
import { CoinGeckoService } from '../controller/coingecko.service';
import { GlobalData } from '../model/GlobalData';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  cryptos: number = -1;
  exchanges: number = -1;
  marketCap: string = '';
  volume24h: string = '';
  change24h: Number = -1;
  btcDominance: string = '';
  ethDominance: string = '';
  updated: string = '';

  sauce = -1;

  constructor(private coinGeckoService: CoinGeckoService) {
    this.coinGeckoService.getGlobalData().subscribe((globalData: GlobalData) => {
      this.cryptos = globalData.data.active_cryptocurrencies;
      this.exchanges = globalData.data.markets;
      this.marketCap = this.numberWithCommas(new Big(globalData.data.total_market_cap.usd).toFixed(0).valueOf());
      this.volume24h = this.numberWithCommas(new Big(globalData.data.total_volume.usd).toFixed(0).valueOf());
      this.change24h = Number(new Big(globalData.data.market_cap_change_percentage_24h_usd).toFixed(2).valueOf());
      this.btcDominance = new Big(globalData.data.market_cap_percentage.btc).toFixed(2).valueOf();
      this.ethDominance = new Big(globalData.data.market_cap_percentage.eth).toFixed(2).valueOf();
      this.updated = moment(new Date(globalData.data.updated_at * 1000)).format('D MMM YYYY, h:mm:ss A');
    });
  }

  ngOnInit(): void {
  }

  numberWithCommas(x: number | string) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

}
