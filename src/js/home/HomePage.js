import { Dom } from "/js/fw/Dom.js";
import { WeatherService } from "/js/nws/WeatherService.js";
import { HomePageForecastModel } from "/js/home/HomePageForecastModel.js";

export class HomePage {

  static getDependencies() {
    return [HTMLElement, Dom, WeatherService];
  }
  constructor(element, dom, weatherService) {
    this.element = element;
    this.dom = dom;
    this.weatherService = weatherService;

    this.weatherService.fetchForecast().then((forecast) => this.applyForecastToUi(forecast));
  }

  setup() {
    this.element.innerHTML = "";
    const fetchDate = this.dom.spawn(this.element, "DIV", ["fetchDate"]);
    const daysContainer = this.dom.spawn(this.element, "DIV", ["daysContainer"]);

    if (this._forecastAwaitingApplication) {
      this.applyForecastToUi(this._forecastAwaitingApplication);
      this._forecastAwaitingApplication = null;
    }
  }

  applyForecastToUi(forecast) {

    // Possible maybe that the forecast arrives before we've initialized the UI.  
    const daysContainer = this.element.querySelector(".daysContainer");
    if (!daysContainer) {
      console.log("Got forecast before ui setup");
      this._forecastAwaitingApplication = forecast;
      return;
    }

    forecast = new HomePageForecastModel(forecast, this.weatherService);

    const fetchDateContainer = this.element.querySelector(".fetchDate");
    fetchDateContainer.innerText = `Fetched at ${forecast.fetchDate}`;

    daysContainer.innerHTML = "";
    for (const row of forecast.rows) {
      this.addUiForRow(daysContainer, row);
    }
  }

  addUiForRow(parent, row) {
    const container = this.dom.spawn(parent, "DIV", ["day"]);
    const dateColumn = this.dom.spawn(container, "DIV", ["date"], null, row.date);
    const dayColumn = this.dom.spawn(container, "DIV", ["forecast", "daytime"]);
    const nightColumn = this.dom.spawn(container, "DIV", ["forecast", "nighttime"]);
    this.applyForecast(dayColumn, row.day);
    this.applyForecast(nightColumn, row.night);
    container.addEventListener("click", () => {
      if (container.classList.contains("details")) {
        container.classList.remove("details");
      } else {
        container.classList.add("details");
      }
    });
  }

  applyForecast(container, forecast) {
    if (!forecast) {
      container.classList.add("nodata");
      return;
    }
    const topRow = this.dom.spawn(container, "DIV", ["topRow"]);
    //const icon = this.dom.spawn(topRow, "IMG", null, { src: forecast.icon });
    const temperature = this.dom.spawn(topRow, "DIV", ["temperature"], null, forecast.temperature);
    const wind = this.dom.spawn(container, "DIV", ["wind"], null, forecast.wind);
    const shortForecast = this.dom.spawn(container, "DIV", ["shortForecast"], null, forecast.shortForecast);
    const detailedForecast = this.dom.spawn(container, "DIV", ["detailedForecast"], null, forecast.detailedForecast);
  }

}
