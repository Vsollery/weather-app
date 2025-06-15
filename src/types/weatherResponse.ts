interface WeatherFormat {
    temp: number;
    temp_min: number;
    temp_max: number;
    dt_txt: string;
    icon: string;
    description: string;
}

export interface WeatherResponse {
    weatherToday: WeatherFormat[];
    weatherTomorrow: WeatherFormat[];
}