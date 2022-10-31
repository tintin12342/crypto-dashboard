import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { CoinListData } from "../model/CoinListData";


@Injectable()
export class CoinGeckoService {
    url: string = 'https://api.coingecko.com/api/v3'

    constructor(private http: HttpClient) {}
    
    getCoinListData() {
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
}