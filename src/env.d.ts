declare namespace App {
    interface Locals {
        WeatherApiParams: WeatherApiParams;
        WeatherApiError: WeatherApiError;
        WeatherApiSuccess: WeatherApiSuccess;
        WeatherApiResponse: WeatherApiResponse;
    }

    interface WeatherApiParams {
        latitude: Array<number>;
        longitude: Array<number>;
        current: string;
        hourly: string;
        daily: string;
    }

    interface WeatherApiError {
        error: string;
    }

    interface WeatherApiSuccess {
        current: {
            time: Date;
            temperature2m: number;
            apparentTemperature: number;
        };
        hourly: {
            time: Date[];
            temperature2m: Float32Array;
            apparentTemperature: Float32Array;
        };
        daily: {
            time: Date[];
            weatherCode: Float32Array;
            sunrise: null;
            sunset: null;
        };
    }

    type WeatherApiResponse = WeatherApiSuccess | WeatherApiError;
}

