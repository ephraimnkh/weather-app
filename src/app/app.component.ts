import { Component } from '@angular/core';
import { WeatherService } from './weather.service';

export interface WeatherRecord {
  date: any;
  time: any;
  temperature: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  currentIntervalID: any;
  dataFailedToLoad = false;

  weatherData: any;
  weatherDataLoaded = false;
  celciusWeatherData: any;
  fahrenheitWeatherData: any;
  weather5DayForecastData: any;
  weather5DayForecastDataLoaded = false;
  celciusWeather5DayForecastData: any;
  fahrenheitWeather5DayForecastData: any;

  showCeliusFahrenheitText = 'Show weather in Fahrenheit';
  celiusOrFahrenheit = 'C';
  speedText = 'km/h';

  displayedColumns: string[] = ['date', 'time', 'temperature'];
  dataSource: any = [];

  currentTemp: any;
  celciusLowerTempAlert = 15;
  celciusHigherTempAlert = 25;
  fahrenheitLowerTempAlert = 59;
  fahrenheitHigherTempAlert = 77;

  refreshDataAfterXMilliseconds = 1200000;

  constructor(private weatherService: WeatherService) {
    this.loadWeatherData();
    this.setupDataRefresh();
  }

  setupDataRefresh() {
    this.currentIntervalID = setInterval(() => {
      this.loadWeatherData();
    }, this.refreshDataAfterXMilliseconds);
  }

  loadWeatherData() {
    this.weatherDataLoaded = false;
    this.weather5DayForecastDataLoaded = false;

    this.weatherService.getCelciusWeatherData().subscribe({
      next: (data: any) => {
        if (data == null) {
          this.startRetryForData();
        } else {
          this.stopRetryingToGetWeatherData();
          this.celciusWeatherData = data;
          if (this.celiusOrFahrenheit === 'C') {
            this.weatherData = this.celciusWeatherData;
            this.weatherDataLoaded = true;
            this.currentTemp = this.roundToWholeNumber(this.weatherData.main.temp);
          }
        }
      }, error: (error: any) => {
        console.error(`Error at getCelciusWeatherData():`, error);
      }
    });
    
    this.weatherService.getFahrenheitWeatherData().subscribe({
      next: (data: any) => {
        if (data == null) {
          this.startRetryForData();
        } else {
          this.stopRetryingToGetWeatherData();
          this.fahrenheitWeatherData = data;
          if (this.celiusOrFahrenheit === 'F') {
            this.weatherData = this.fahrenheitWeatherData;
            this.weatherDataLoaded = true;
            this.currentTemp = this.roundToWholeNumber(this.weatherData.main.temp);
          }
        }
      }, error: (error: any) => {
        console.error(`Error at getFahrenheitWeatherData():`, error);
      }
    });
    
    this.weatherService.get5DayCelciusWeatherData().subscribe({
      next: (data: any) => {
        if (data == null) {
          this.startRetryForData();
        } else {
          this.stopRetryingToGetWeatherData();
          this.celciusWeather5DayForecastData = data;
          if (this.celiusOrFahrenheit === 'C') { 
            this.weather5DayForecastData = this.celciusWeather5DayForecastData;
            this.weather5DayForecastDataLoaded = true;
            this.dataSource = this.weather5DayForecastData.list.map((data: any) => {
              return {
                date: new Date(data.dt_txt).toDateString(),
                time: `${new Date(data.dt_txt).getHours().toString().padStart(2, '0')}:${new Date(data.dt_txt).getMinutes().toString().padStart(2, '0')}`,
                temperature: data.main.temp
              }
            });
          }
        }
      }, error: (error: any) => {
        console.error(`Error at get5DayCelciusWeatherData():`, error);
      }
    });
    
    this.weatherService.get5DayFahrenheitWeatherData().subscribe({
      next: (data: any) => {
        if (data == null) {
          this.startRetryForData();
        } else {
          this.stopRetryingToGetWeatherData();
          this.fahrenheitWeather5DayForecastData = data;
          if (this.celiusOrFahrenheit === 'F') { 
            this.weather5DayForecastData = this.fahrenheitWeather5DayForecastData;
            this.weather5DayForecastDataLoaded = true;
            this.dataSource = this.weather5DayForecastData.list.map((data: any) => {
              return {
                date: new Date(data.dt_txt).toDateString(),
                time: `${new Date(data.dt_txt).getHours().toString().padStart(2, '0')}:${new Date(data.dt_txt).getMinutes().toString().padStart(2, '0')}`,
                temperature: data.main.temp
              }
            });
          }
        }
      }, error: (error: any) => {
        console.error(`Error at get5DayFahrenheitWeatherData():`, error);
      }
    });
  }

  refreshData() {
    this.clearAppRefreshTimer();
    this.loadWeatherData();
    this.setupDataRefresh();
  }

  retryAfterXMilliseconds = 2000;
  retrySetTimeoutID: any;
  retryActive = false;

  startRetryForData() {
    if (!this.retryActive) {
      this.weatherData = null;
      this.weather5DayForecastData = null;
      this.retryGettingWeatherData();
    }
  }

  retryGettingWeatherData() {
    this.weatherDataLoaded = false;
    this.weather5DayForecastDataLoaded = false;
    this.retryActive = true;
    this.dataFailedToLoad = true;

    this.clearAppRefreshTimer();
    this.clearAppRetryTimeout();

    if (this.weatherData == null || this.weather5DayForecastData == null) {
      this.retrySetTimeoutID = setTimeout(() => {
        this.refreshData();
        this.retryAfterXMilliseconds *= 2;
        this.retryGettingWeatherData();
      }, this.retryAfterXMilliseconds);
    } else {
      this.stopRetryingToGetWeatherData();
    }
  }
  
  stopRetryingToGetWeatherData() {
    if (this.retryActive) {
      this.retryActive = false;
      this.dataFailedToLoad = false;
      this.retryAfterXMilliseconds = 2000;
      this.clearAppRetryTimeout();
      this.setupDataRefresh();
    }
  }

  clearAppRefreshTimer() {
    clearInterval(this.currentIntervalID);
  }
  
  clearAppRetryTimeout() {
    clearTimeout(this.retrySetTimeoutID);
  }
  
  changeWeatherUnit() {
    if (this.celiusOrFahrenheit === 'C') {
      this.weatherData = this.fahrenheitWeatherData;
      this.currentTemp = this.roundToWholeNumber(this.weatherData.main.temp);
      this.weather5DayForecastData = this.fahrenheitWeather5DayForecastData;
      this.dataSource = this.weather5DayForecastData.list.map((data: any) => {
        return {
          date: new Date(data.dt_txt).toDateString(),
          time: `${new Date(data.dt_txt).getHours().toString().padStart(2, '0')}:${new Date(data.dt_txt).getMinutes().toString().padStart(2, '0')}`,
          temperature: data.main.temp
        }
      });
      this.celiusOrFahrenheit = 'F';
      this.speedText = 'mph';
      this.showCeliusFahrenheitText = 'Show weather in Celcius';
    } else if (this.celiusOrFahrenheit === 'F') {
      this.weatherData = this.celciusWeatherData;
      this.currentTemp = this.roundToWholeNumber(this.weatherData.main.temp);
      this.weather5DayForecastData = this.celciusWeather5DayForecastData;
      this.dataSource = this.weather5DayForecastData.list.map((data: any) => {
        return {
          date: new Date(data.dt_txt).toDateString(),
          time: `${new Date(data.dt_txt).getHours().toString().padStart(2, '0')}:${new Date(data.dt_txt).getMinutes().toString().padStart(2, '0')}`,
          temperature: data.main.temp
        }
      });
      this.celiusOrFahrenheit = 'C';
      this.speedText = 'km/h';
      this.showCeliusFahrenheitText = 'Show weather in Fahrenheit';
    }
  }

  roundToWholeNumber(number: number) {
    return Math.round(number);
  }
}