export interface WeatherRequest {
    lat: number,
    lon: number,
    exclude?: string,
    unit?: "metric" | "imperial",
}
