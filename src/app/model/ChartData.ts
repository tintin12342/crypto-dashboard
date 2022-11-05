export interface ChartData {
    market_caps: [marketCapData] | null,
    prices: [priceData] | null,
    total_volumes: [volumeData] | null
}

export interface priceData {
    time: number | Date | string,
    value: number
}

export interface marketCapData {
    time: number | Date | string,
    value: number
}

export interface volumeData {
    time: number | Date | string,
    value: number
}