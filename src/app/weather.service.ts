import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  APIKey = 'PLACE API KEY HERE';

  constructor(private http: HttpClient) { }

  getCelciusWeatherData() {
    return this.http.get(`http://localhost:8080/get-weather-data/${this.APIKey}/metric`);
  }
  
  getFahrenheitWeatherData() {
    return this.http.get(`http://localhost:8080/get-weather-data/${this.APIKey}/imperial`);
  }
  
  get5DayCelciusWeatherData() {
    return this.http.get(`http://localhost:8080/get-weather-forecast-data/${this.APIKey}/metric`);
  }

  get5DayFahrenheitWeatherData() {
    return this.http.get(`http://localhost:8080/get-weather-forecast-data/${this.APIKey}/imperial`);
  }
}
