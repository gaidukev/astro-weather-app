import { fetchWeatherApi } from "openmeteo";

const queryApi = async (params : {latitude: Array<number>, longitude: Array<number>, current: string, hourly: string, daily: string}) => {

    const url = "https://api.open-meteo.com/v1/forecast";
    let responses;
    try {
        responses = await fetchWeatherApi(url, params);
    
        // Helper function to form time ranges
        const range = (start: number, stop: number, step: number) =>
            Array.from(
                { length: (stop - start) / step },
                (_, i) => start + i * step,
            );
    
        // Process first location. Add a for-loop for multiple locations or weather models
        const response = responses[0];
    
        // Attributes for timezone and location
        const utcOffsetSeconds = response.utcOffsetSeconds();
        const timezone = response.timezone();
        const timezoneAbbreviation = response.timezoneAbbreviation();
        const latitude = response.latitude();
        const longitude = response.longitude();
    
        const current = response.current()!;
        const hourly = response.hourly()!;
        const daily = response.daily()!;
    
        // Note: The order of weather variables in the URL query and the indices below need to match!
        const weatherData = {
            current: {
                time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
                temperature2m: current.variables(0)!.value(),
                apparentTemperature: current.variables(1)!.value(),
                isDay: current.variables(2)!.value(),
                precipitation: current.variables(3)!.value(),
                rain: current.variables(4)!.value(),
                showers: current.variables(5)!.value(),
                snowfall: current.variables(6)!.value(),
                cloudCover: current.variables(7)!.value(),
            },
            hourly: {
                time: range(
                    Number(hourly.time()),
                    Number(hourly.timeEnd()),
                    hourly.interval(),
                ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
                temperature2m: hourly.variables(0)!.valuesArray()!,
                apparentTemperature: hourly.variables(1)!.valuesArray()!,
                precipitation: hourly.variables(2)!.valuesArray()!,
                rain: hourly.variables(3)!.valuesArray()!,
                showers: hourly.variables(4)!.valuesArray()!,
                snowfall: hourly.variables(5)!.valuesArray()!,
                snowDepth: hourly.variables(6)!.valuesArray()!,
                weatherCode: hourly.variables(7)!.valuesArray()!,
            },
            daily: {
                time: range(
                    Number(daily.time()),
                    Number(daily.timeEnd()),
                    daily.interval(),
                ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
                weatherCode: daily.variables(0)!.valuesArray()!,
                sunrise: daily.variables(1)!.valuesArray()!,
                sunset: daily.variables(2)!.valuesArray()!,
                daylightDuration: daily.variables(3)!.valuesArray()!,
                sunshineDuration: daily.variables(4)!.valuesArray()!,
                uvIndexMax: daily.variables(5)!.valuesArray()!,
                uvIndexClearSkyMax: daily.variables(6)!.valuesArray()!,
                windSpeed10mMax: daily.variables(7)!.valuesArray()!,
                windGusts10mMax: daily.variables(8)!.valuesArray()!,
            },
        };
        console.log(weatherData)
    } catch (error) {
        console.error("Weather API Error:", error);
        responses = { error: "Failed to fetch weather data" };
    }
    
    return responses
}

export {queryApi}