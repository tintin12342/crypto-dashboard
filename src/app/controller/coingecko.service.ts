import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { CoinListData } from "../model/CoinListData";
import { OHLC } from "../model/OHLC";
import { Observable, BehaviorSubject } from "rxjs";
import { ChartData } from "../model/ChartData";
import { GlobalData } from "../model/GlobalData";
import { CoinData } from "../model/CoinData";


@Injectable()
export class CoinGeckoService {
    private url: string = 'https://api.coingecko.com/api/v3';
    private ohlcData = new BehaviorSubject<OHLC[]>([]);
    private titleObservable = new BehaviorSubject<string>('');
    private coinIdObservable = new BehaviorSubject<string>('');
    private areaSelectObservable = new BehaviorSubject<any>(null);
    private chartData = new BehaviorSubject<ChartData>({
        prices: null,
        market_caps: null,
        total_volumes: null
    });

    constructor(private http: HttpClient) {}

    getGlobalData(): Observable<GlobalData> {
        return this.http.get<GlobalData>(`${this.url}/global`)
    }

    getCoinData(id: string): Observable<CoinData> {
        return this.http.get<CoinData>(`${this.url}/coins/${id}`)
    }
    
    getCoinListData(): Observable<CoinListData[]> {
        return this.http.get<CoinListData[]>(`${this.url}/coins/markets`, {
            params: {
                'vs_currency': 'usd',
                'order': 'gecko_desc',
                'per_page': '100',
                'page': '1',
                'price_change_percentage': '1h,24h,7d'
            }
        })
    }

    setChartTitle(title: string): void {
        this.titleObservable.next(title);
    }

    getChartTitle(): Observable<string> {
        return this.titleObservable.asObservable()
    }

    getCurrentCoinId(): Observable<string> {
        return this.coinIdObservable.asObservable()
    }

    getAreaSelectData(): Observable<any> {
        return this.areaSelectObservable.asObservable();
    }

    setAreaSelectData(params: any, coinPrices: number[]): void {
        this.areaSelectObservable.next({params: params, coinPrices: coinPrices});
    }

    resetAreaSelectData(): void { 
        this.areaSelectObservable.next(null);
    }

    setChartData(id: string, days: string): void {
        this.coinIdObservable.next(id);

        this.http.get<ChartData>(`${this.url}/coins/${id}/market_chart`, {
            params: {
                'vs_currency': 'usd',
                'days': days
            }
        }).subscribe((chartData: ChartData) => {
            this.chartData.next(chartData);
        });
    }

    getChartData(): Observable<ChartData> {
        return this.chartData.asObservable()
    }

    setOHLCData(id: string): void {
        this.http.get<OHLC[]>(`${this.url}/coins/${id}/ohlc`, {
            params: {
                'vs_currency': 'usd',
                'days': '7'
            }
        }).subscribe((ohlc: OHLC[]) => {
            this.ohlcData.next(ohlc);
        })
    }

    getOHLCData(): Observable<OHLC[]> {
        return this.ohlcData.asObservable()
    }
}