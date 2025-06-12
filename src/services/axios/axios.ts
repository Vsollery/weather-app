import axios from 'axios';
import {WeatherRequest} from "@/types/weatherRequest";
import {WeatherResponse} from "@/types/weatherResponse";


const axiosPrivate = axios.create({
    baseURL: "https://api.openweathermap.org/data/3.0/onecall",
});

export const getWeatherData = async (params: WeatherRequest): Promise<WeatherResponse> => {
    const apiKey = process.env.VUE_APP_WEATHER_API_KEY;

    const response = await axiosPrivate.get('',{
        params : {
            ...params,
            appid: apiKey,
        },
    });
    return response.data;
}