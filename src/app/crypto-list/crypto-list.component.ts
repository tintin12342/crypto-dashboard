import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CoinGeckoService } from '../controller/coingecko.service';
import { CoinListData } from '../model/CoinListData';
import { NgxTippyService } from 'ngx-tippy-wrapper';

@Component({
  selector: 'app-crypto-list',
  templateUrl: './crypto-list.component.html',
  styleUrls: ['./crypto-list.component.css']
})
export class CryptoListComponent implements OnInit, AfterViewInit {
  listDataSource: CoinListData[] = [];

  constructor(private coinGeckoService: CoinGeckoService, private tippyService: NgxTippyService) { 
    this.coinGeckoService.getCoinListData().subscribe((coinListData: CoinListData[]) => {
      this.listDataSource = coinListData.map((data: CoinListData) => {
        this.formatListData(data);
        return data
      });
    });
  }
  ngAfterViewInit(): void {
    
  }

  ngOnInit(): void {
  }

  formatListData(data: CoinListData) {
    data.progress = Math.floor((Math.floor(Number(data.circulating_supply)) / Math.floor(Number(data.total_supply))) * 100);
    if (data.progress === Infinity) data.progress = 100;

    data.price_change_percentage_1h_in_currency = Math.round(data.price_change_percentage_1h_in_currency * 100 + Number.EPSILON ) / 100;
    data.price_change_percentage_24h_in_currency = Math.round(data.price_change_percentage_24h_in_currency * 100 + Number.EPSILON ) / 100;
    data.price_change_percentage_7d_in_currency = Math.round(data.price_change_percentage_7d_in_currency * 100 + Number.EPSILON ) / 100;
    
    data.market_cap = this.numberWithCommas(data.market_cap);

    data.circulating_supply = Math.floor(Number(data.circulating_supply));
    data.circulating_supply = this.numberWithCommas(data.circulating_supply);

    data.total_supply = Math.floor(Number(data.total_supply));
    data.total_supply = this.numberWithCommas(data.total_supply);
  }

  numberWithCommas(x: number | string) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}
