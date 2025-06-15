import axios from 'axios';
import {WeatherRequest} from "@/types/weatherRequest";
import {WeatherResponse} from "@/types/weatherResponse";
import {CityCoordinate} from "@/types/cityCoordinates";


const axiosPrivate = axios.create({
    baseURL: "https://api.openweathermap.org",
});

const apiKey = process.env.VUE_APP_WEATHER_API_KEY;

const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);

function formatDate(date: Date) {
    return date.toISOString().slice(0, 10); // 'YYYY-MM-DD'
}

function mapForecast(forecast: any){
    return{
        temp: forecast.main.temp,
        temp_min: forecast.main.temp_min,
        temp_max: forecast.main.temp_max,
        dt_txt: forecast.dt_txt,
        icon: forecast.weather[0].icon,
        description: forecast.weather[0].description,
    }
}

export const getWeatherData = async (params: WeatherRequest): Promise<WeatherResponse> => {
    try{
        const response = await axiosPrivate.get('/data/2.5/forecast/',{
            params : {
                ...params,
                appid: apiKey,
            },
        });

        const forecasts = response.data.list;
        const todayStr = formatDate(today);
        const tomorrowStr = formatDate(tomorrow);

        const weatherToday = forecasts
            .filter((f: any) => f.dt_txt.startsWith(todayStr))
            .map(mapForecast);

        const weatherTomorrow = forecasts
            .filter((f: any) => f.dt_txt.startsWith(tomorrowStr))
            .map(mapForecast);

        return {
            weatherToday,
            weatherTomorrow,
        };
    }catch(error){
        console.log(error);
        throw error;
    }
}

export const getCityCoordinates = async (cityName: string): Promise<CityCoordinate[]> => {
    try{
        const response = await axiosPrivate.get('/geo/1.0/direct',{
            params: {
                q: cityName,
                limit: 10,
                appid: apiKey,
            }
        });
        return response.data;
    }catch (error) {
        console.error("Error getting coordinate:", error);
        throw error;
    }


}