import { Component, OnInit } from '@angular/core';
import Big from 'big.js';
import * as moment from 'moment';
import { CoinGeckoService } from '../controller/coingecko.service';
import { CoinData } from '../model/CoinData';
import { GlobalData } from '../model/GlobalData';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  updated: string = '';

  areaSelectData: any = null;
  leftSelect: string = ''; 
  rightSelect: string = ''; 
  amount: number = -1; 
  percent: string = '';

  imageUrl: string = '';
  name: string = '';
  rank: number = -1;
  totalVol: string = '';
  ath: number = -1;
  atl: number = -1;
  athDate: string = '';
  atlDate: string = '';
  percentage2w: number = -1;
  percentage1m: number = -1;
  percentage1y: number = -1;
  marketCapChange: string = '';
  marketCapChangePercentage: number = -1;
  genesisDate: string = '';
  
  constructor(private coinGeckoService: CoinGeckoService) {
    this.coinGeckoService.getGlobalData().subscribe((globalData: GlobalData) => {
      this.updated = moment(new Date(globalData.data.updated_at * 1000)).format('D MMM YYYY, h:mm:ss A');
    });

    this.coinGeckoService.getAreaSelectData().subscribe(data => {
      this.areaSelectData = data;
      if (!data) return;
      this.leftSelect = data.coinPrices[data.params.batch[0].areas[0].coordRanges[0][0]];
      this.rightSelect = data.coinPrices[data.params.batch[0].areas[0].coordRanges[0][1]];
      this.amount = Number(new Big(this.rightSelect).sub(this.leftSelect).valueOf());
      this.percent = String((Number((new Big(this.leftSelect).sub(this.rightSelect)).div(this.leftSelect)) * -100).toFixed(4));
    });

    this.coinGeckoService.getCurrentCoinId().subscribe(id => {
      if(id === '') return;
      this.coinGeckoService.getCoinData(id).subscribe((coinData: CoinData) => {
        this.imageUrl = coinData.image.small;
        this.name = coinData.name;
        this.rank = coinData.market_data.market_cap_rank;
        this.totalVol = this.numberWithCommas(coinData.market_data.total_volume.usd);
        this.ath = coinData.market_data.ath.usd;
        this.athDate = moment(coinData.market_data.ath_date.usd).format('D MMM YYYY, h:mm:ss A');
        this.atl = coinData.market_data.atl.usd;
        this.atlDate = moment(coinData.market_data.atl_date.usd).format('D MMM YYYY, h:mm:ss A');
        this.percentage2w = Number(coinData.market_data.price_change_percentage_14d.toFixed(2));
        this.percentage1m = Number(coinData.market_data.price_change_percentage_30d.toFixed(2));
        this.percentage1y = Number(coinData.market_data.price_change_percentage_1y.toFixed(2));
        this.marketCapChange = this.numberWithCommas(coinData.market_data.market_cap_change_24h.toFixed(0));
        this.marketCapChangePercentage = Number(coinData.market_data.market_cap_change_percentage_24h.toFixed(2));

        if (coinData.genesis_date === null) this.genesisDate = 'unknown';
        else this.genesisDate = moment(coinData.genesis_date).format('D MMM YYYY');
      })
    })
  }

  ngOnInit(): void {
  }

  numberWithCommas(x: number | string) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}
