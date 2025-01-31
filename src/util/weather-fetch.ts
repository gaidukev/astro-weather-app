import { fetchWeatherApi } from "openmeteo";
import type { WeatherApiResponse as OpenMeteoResponse, VariablesWithTime } from "@openmeteo/sdk";

const queryApi = async (params: { latitude: Array<number>, longitude: Array<number>, current: string, hourly: string, daily: string }) => {
    const url = "https://api.open-meteo.com/v1/forecast";
    let result: App.WeatherApiResponse;
    try {
        const responses: OpenMeteoResponse[] = await fetchWeatherApi(url, params, 10, 4, 100);

        // Helper function to form time ranges
        const range = (start: number, stop: number, step: number) =>
            Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);


        const response = responses[0];

        // Attributes for timezone and location
        const utcOffsetSeconds = response.utcOffsetSeconds();
        const timezone = response.timezone();
        const timezoneAbbreviation = response.timezoneAbbreviation();
        const latitude = response.latitude();
        const longitude = response.longitude();

        const current = response.current();
        const hourly = response.hourly();
        const daily = response.daily();

        // Transform the response into our expected format
        result = {
            current: {
                time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
                temperature2m: current.variables(0)!.value(),
                apparentTemperature: current.variables(1)!.value(),
            },
            hourly: {
                time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
                    (t) => new Date((t + utcOffsetSeconds) * 1000)
                ),
                temperature2m: hourly.variables(0)!.valuesArray()!,
                apparentTemperature: hourly.variables(1)!.valuesArray()!,
            },
            daily: {
                time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
                    (t) => new Date((t + utcOffsetSeconds) * 1000)
                ),
                weatherCode: daily.variables(0)!.valuesArray()!,
                sunrise: daily.variables(1)!.valuesArray()!,
                sunset: daily.variables(2)!.valuesArray()!,
            },
        };

        // // `weatherData` now contains a simple structure with arrays for datetime and weather data
        // for (let i = 0; i < weatherData.hourly.time.length; i++) {
        //     console.log(
        //         weatherData.hourly.time[i].toISOString(),
        //         weatherData.hourly.temperature2m[i],
        //         weatherData.hourly.apparentTemperature[i]
        //     );
        // }
        // for (let i = 0; i < weatherData.daily.time.length; i++) {
        //     console.log(
        //         weatherData.daily.time[i].toISOString(),
        //         weatherData.daily.weatherCode[i],
        //         weatherData.daily.sunrise[i],
        //         weatherData.daily.sunset[i]
        //     );
        // }
    } catch (error) {
        console.error("Weather API Error:", error);
        result = { error: "Failed to fetch weather data" };
    }

    return result;
}

export { queryApi }