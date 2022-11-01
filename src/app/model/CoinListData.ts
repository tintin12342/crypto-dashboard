export interface CoinListData {
    id: string,
    image: string,
    name: string,
    symbol: string,
    current_price: number,
    price_change_percentage_1h_in_currency: number,
    price_change_percentage_24h_in_currency: number,
    price_change_percentage_7d_in_currency: number,
    market_cap: number | string,
    circulating_supply: number | string,
    total_supply: number | string,
    progress: number,
}