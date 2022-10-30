import { Component, OnInit } from '@angular/core';
import { CoinGeckoService } from '../controller/coingecko.service';

@Component({
  selector: 'app-crypto-list',
  templateUrl: './crypto-list.component.html',
  styleUrls: ['./crypto-list.component.css']
})
export class CryptoListComponent implements OnInit {

  constructor(private coinGeckoService: CoinGeckoService) { 
    this.coinGeckoService.getCoinListData().subscribe((response) => {
      
    })
  }

  ngOnInit(): void {
  }

}
