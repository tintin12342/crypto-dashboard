import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { CoinListData } from "../model/CoinListData";
import { OHLC } from "../model/OHLC";
import { Observable, BehaviorSubject } from "rxjs";


@Injectable()
export class CoinGeckoService {
    private url: string = 'https://api.coingecko.com/api/v3';
    private ohlcData = new BehaviorSubject<OHLC[]>([]);

    constructor(private http: HttpClient) {}
    
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

    setOHLCData(id: string): void {
        this.http.get<OHLC[]>(`${this.url}/coins/${id}/ohlc`, {
            params: {
                'vs_currency': 'usd',
                'days': '1'
            }
        }).subscribe((ohlc: OHLC[]) => {
            this.ohlcData.next(ohlc);
        })
    }

    getOHLCData(): Observable<OHLC[]> {
        return this.ohlcData.asObservable()
    }
}