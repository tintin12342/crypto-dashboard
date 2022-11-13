import { Component, OnInit } from '@angular/core';
import { CoinGeckoService } from '../controller/coingecko.service';
import { GlobalData } from '../model/GlobalData';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(private coinGeckoService: CoinGeckoService) {
    this.coinGeckoService.getGlobalData().subscribe((globalData: GlobalData) => {
      
    });
  }

  ngOnInit(): void {
  }

}
