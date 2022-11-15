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
  updated: string = '';
  
  constructor(private coinGeckoService: CoinGeckoService) {
    this.coinGeckoService.getGlobalData().subscribe((globalData: GlobalData) => {
      this.updated = moment(new Date(globalData.data.updated_at * 1000)).format('D MMM YYYY, h:mm:ss A');
    });
  }

  ngOnInit(): void {
  }
}
