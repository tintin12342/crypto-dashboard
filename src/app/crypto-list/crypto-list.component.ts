import { Component, OnInit } from '@angular/core';
import { CoinGeckoService } from '../controller/coingecko.service';
import { CoinListData } from '../model/CoinListData';

@Component({
  selector: 'app-crypto-list',
  templateUrl: './crypto-list.component.html',
  styleUrls: ['./crypto-list.component.css']
})
export class CryptoListComponent implements OnInit {
  displayedColumns: string[] = ['rank', 'name', 'price', '1h', '24h', '7d', 'marketCap'];
  listDataSource: CoinListData[] = [];

  constructor(private coinGeckoService: CoinGeckoService) { 
    this.coinGeckoService.getCoinListData().subscribe((coinListData: CoinListData[]) => {
      this.listDataSource = coinListData.map((data: CoinListData) => {
        data.price_change_percentage_1h_in_currency = Math.round(data.price_change_percentage_1h_in_currency * 100 + Number.EPSILON ) / 100;
        data.price_change_percentage_24h_in_currency = Math.round(data.price_change_percentage_24h_in_currency * 100 + Number.EPSILON ) / 100;
        data.price_change_percentage_7d_in_currency = Math.round(data.price_change_percentage_7d_in_currency * 100 + Number.EPSILON ) / 100;
        data.market_cap = this.numberWithCommas(data.market_cap);
        
        return data
      });
    })
  }

  ngOnInit(): void {
  }

  numberWithCommas(x: number | string) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}
