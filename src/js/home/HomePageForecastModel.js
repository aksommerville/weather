export class HomePageForecastModel {

  constructor(weatherServiceForecast, weatherService) {

    this.fetchDate = "unknown";
    this.rows = [];
    /* Each item in (rows) is a day: {
     *  date: "MM/DD",
     *  day: period | null,
     *  night: period | null,
     * }
     * period: {
     *   temperature: string, // with unit
     *   wind: string, // with unit and direction
     *   icon: url,
     *   shortForecast: string,
     *   detailedForecast: string,
     * }
     */

    this.populate(weatherServiceForecast, weatherService);
  }

  populate(input, service) {
    if (!input || !service) {
      this.fetchDate = "unknown";
      this.rows = [];
      return;
    }
    this.populateFetchDate(service.getForecastDate(input));
    this.rows = [];
    const periodCount = service.getForecastPeriodCount(input);
    for (let i=0; i<periodCount; i++) this.addPeriod(service.getForecastPeriod(input, i));
  }

  populateFetchDate(date) {
    if (date) {
      this.fetchDate = date.toLocaleString();
    } else {
      this.fetchDate = "unknown";
    }
  }

  addPeriod(period) {
    const date = this.normalizeDate(period.startTime);
    const row = this.getRowForDate(date);
    if (period.isDaytime) {
      row.day = this.reformatPeriod(period);
    } else {
      row.night = this.reformatPeriod(period);
    }
  }

  reformatPeriod(input) {
    return {
      temperature: this.reprTemperature(input),
      wind: this.reprWind(input),
      icon: this.adjustIconUrl(input.icon),
      shortForecast: input.shortForecast,
      detailedForecast: input.detailedForecast,
    };
  }

  reprTemperature(period) {
    return `${period.temperature} ${period.temperatureUnit}`;
  }

  reprWind(period) {
    return `${period.windSpeed} ${period.windDirection}`;
  }

  adjustIconUrl(url) {
    return url.replace("size=medium", "size=small");
  }

  getRowForDate(date) {
    for (let p=0; p<this.rows.length; p++) {
      if (this.rows[p].date === date) return this.rows[p];
      if (this.rows[p].date > date) return this.insertRow(p, date);
    }
    return this.insertRow(this.rows.length, date);
  }

  insertRow(p, date) {
    const row = { date, day: null, night: null };
    this.rows.splice(p, 0, row);
    return row;
  }

  // "MM/DD" local
  normalizeDate(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month.toString().padStart(2, "0")}/${day.toString().padStart(2, "0")}`;
  }

}
