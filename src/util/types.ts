export type WeatherApiParams = {
    latitude: Array<number>;
    longitude: Array<number>;
    current: string;
    hourly: string;
    daily: string;
}

export type WeatherApiError = {
    error: string;
}

export type WeatherApiSuccess = {
    current: {
        time: Date;
        temperature2m: number;
        apparentTemperature: number;
    };
    hourly: {
        time: Date[];
        temperature2m: number[];
        apparentTemperature: number[];
    };
    daily: {
        time: Date[];
        weatherCode: number[];
        sunrise: Date[] | null;
        sunset: Date[] | null;
    };
}

export type WeatherApiResponse = WeatherApiSuccess | WeatherApiError;
