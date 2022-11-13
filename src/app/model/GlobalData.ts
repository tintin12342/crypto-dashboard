export interface GlobalData {
    data: {
        active_cryptocurrencies: number,
        upcoming_icos: number,
        ongoing_icos: number,
        ended_icos: number,
        markets: number,
        total_market_cap: {
            btc: number
            eth: number
            usd: number
        },
        total_volume: {
            btc: number
            eth: number
            usd: number
        },
        market_cap_percentage: {
            btc: number
            eth: number
        },
        market_cap_change_percentage_24h_usd: number,
        updated_at: number
    }
}