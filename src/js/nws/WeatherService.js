import { NwsTransport } from "/js/nws/NwsTransport.js";

export class WeatherService {

  static getDependencies() {
    return [NwsTransport];
  }
  constructor(nwsTransport) {
    this.nwsTransport = nwsTransport;
  }

  /* fetchForecast()
   * Returns a Promise resolving to a forecast object.
   * We don't modify the object here; use our accessors to read it safely.
   * We should implement a cache right here.
   ***************************************************************************/

  fetchForecast_MOCK() {
    return Promise.resolve(WeatherService.CANNED_FORECAST_RESPONSE);
  }

  fetchForecast() {
    const path = "/gridpoints/ILN/84,41/forecast";//TODO WeatherService should hold "current location"
    return this.nwsTransport.get(path).then(response => {
      if (!response.ok) throw response;
      return response.json();
    });
  }

  /* Forecast accessors.
   ***************************************************************************/

  getForecastDate(forecast) {
    try {
      return new Date(forecast.properties.generatedAt);
    } catch (e) {
      return null;
    }
  }

  getForecastPeriodCount(forecast) {
    try {
      return forecast.properties.periods.length;
    } catch (e) {
      return 0;
    }
  }

  // See transformForecastPeriod() for format details.
  getForecastPeriod(forecast, p) {
    try {
      const periods = forecast.properties.periods;
      const period = forecast.properties.periods[p];
      if (!period) throw null;
      return this.transformForecastPeriod(period);
    } catch (e) {
      return null;
    }
  }

  /* Transformations.
   ***************************************************************************/

  /* In (straight off the NWS response): {
   *   number:1,
   *   name:"Today",
   *   startTime:"2020-03-29T08:00:00-04:00",
   *   endTime:"2020-03-29T18:00:00-04:00",
   *   isDaytime:true,
   *   temperature:67,
   *   temperatureUnit:"F",
   *   temperatureTrend:null, // always null in my sample response
   *   windSpeed:"13 to 23 mph",
   *   windDirection:"SW",
   *   icon:"https://api.weather.gov/icons/land/day/wind_sct?size=medium",
   *   shortForecast:"Mostly Sunny",
   *   detailedForecast:"Mostly sunny, with a high near 67. Southwest wind 13 to 23 mph, with gusts as high as 44 mph.",
   * }
   * Out: {
   *   name: string,
   *   startTime: date,
   *   endTime: date,
   *   isDaytime: boolean,
   *   temperature: number,
   *   temperatureUnit: string,
   *   windSpeed: string, // with unit
   *   windDirection: string,
   *   icon: url,
   *   shortForecast: string,
   *   detailedForecast: string,
   * }
   */
  transformForecastPeriod(input) {
    return {
      name: input.name || "",
      startTime: new Date(input.startTime),
      endTime: new Date(input.endTime),
      isDaytime: !!input.isDaytime,
      temperature: +input.temperature || 0,
      temperatureUnit: input.temperatureUnit || "",
      windSpeed: input.windSpeed || "?",
      windDirection: input.windDirection || "?",
      icon: input.icon || "",
      shortForecast: input.shortForecast || "",
      detailedForecast: input.detailedForecast || "",
    };
  }

}

WeatherService.singleton = true;
