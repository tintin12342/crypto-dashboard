export interface CoinData {
    id: string,
    name: string,
    image: {
        small: string
    }
    genesis_date: string,
    market_data: {
        ath: {
           usd: number
        },
        ath_date: {
            usd: string
        },
        atl: {
           usd: number
        },
        atl_date: {
            usd: string
        },
        market_cap_rank: number,
        total_volume: {
           usd: number
        },
        price_change_percentage_14d: number,
        price_change_percentage_30d: number,
        price_change_percentage_1y: number,
        market_cap_change_24h: number,
        market_cap_change_percentage_24h: number,
    }
}