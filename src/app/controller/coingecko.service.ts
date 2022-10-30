import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';


@Injectable()
export class CoinGeckoService {
    url: string = 'https://api.coingecko.com/api/v3'

    constructor(private http: HttpClient) {}
    
    getCoinListData() {
        return this.http.get(`${this.url}/coins/markets`, {
            params: {
                'vs_currency': 'usd',
                'order': 'gecko_desc',
                'per_page': '100',
                'page': '1',
                'sparkline': 'false',
                'price_change_percentage': '1h%2C24h%2C7d'
            }
        })
    }
}