import { Component, OnInit } from '@angular/core';
import { CoinGeckoService } from '../controller/coingecko.service';
import { CoinListData } from '../model/CoinListData';
import Big from 'big.js';

@Component({
  selector: 'app-crypto-list',
  templateUrl: './crypto-list.component.html',
  styleUrls: ['./crypto-list.component.css']
})
export class CryptoListComponent implements OnInit {
  listDataSource: CoinListData[] = [];

  constructor(private coinGeckoService: CoinGeckoService) { 
    this.coinGeckoService.getCoinListData().subscribe((coinListData: CoinListData[]) => {
      this.listDataSource = coinListData.map((data: CoinListData) => {
        this.formatListData(data);
        return data
      });
    });
  }

  ngOnInit(): void {
  }

  formatListData(data: CoinListData) {
    const circulating_supply = new Big(data.circulating_supply);
    if (!data.total_supply) data.total_supply = data.circulating_supply;
    data.progress = Number(circulating_supply.div(data.total_supply).times(100).toFixed(2).valueOf());
    
    data.price_change_percentage_1h_in_currency = Number(new Big(data.price_change_percentage_1h_in_currency).toFixed(2).valueOf());
    data.price_change_percentage_24h_in_currency = Number(new Big(data.price_change_percentage_24h_in_currency).toFixed(2).valueOf());
    data.price_change_percentage_7d_in_currency = Number(new Big(data.price_change_percentage_7d_in_currency).toFixed(2).valueOf());
    
    data.market_cap = this.numberWithCommas(data.market_cap);

    data.circulating_supply = Number(Big(data.circulating_supply).round().valueOf());
    data.circulating_supply = this.numberWithCommas(data.circulating_supply);

    data.total_supply = Number(Big(data.total_supply).round().valueOf());
    data.total_supply = this.numberWithCommas(data.total_supply);
  }

  numberWithCommas(x: number | string) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  onItemClick(coin: CoinListData) {
    this.coinGeckoService.setChartData(coin.id, '1');
    this.coinGeckoService.setChartTitle(coin.name);
  }
}
