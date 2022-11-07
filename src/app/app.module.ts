import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { NgxTippyModule } from 'ngx-tippy-wrapper';

import { NgxEchartsModule } from 'ngx-echarts';

import { CryptoListComponent } from './crypto-list/crypto-list.component';
import { SelectedChartComponent } from './selected-chart/selected-chart.component';
import { CryptoConverterComponent } from './crypto-converter/crypto-converter.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CoinGeckoService } from './controller/coingecko.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    CryptoListComponent,
    SelectedChartComponent,
    CryptoConverterComponent,
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatToolbarModule,
    HttpClientModule,
    MatListModule,
    MatProgressBarModule,
    NgxTippyModule,
    MatButtonToggleModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    })
  ],
  providers: [CoinGeckoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
