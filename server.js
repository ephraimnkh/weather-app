const express = require('express');
const app = express();
const path = require('path');
const axios = require('axios');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "dist/weather-app")));

app.get('/get-weather-data/:appid/:units', (request, response) => {
    const city = 'Cape Town';
    axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${encodeURI(city)}&limit=1&appid=${request.params.appid}`)
    .then(locationResponse => {
        axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${locationResponse.data[0].lat}&lon=${locationResponse.data[0].lon}&units=${request.params.units}&appid=${request.params.appid}`)
        .then(res => {
            response.json(res.data);
        })
        .catch(error => {
            console.error(`Error getting weather data: ${error}`);
            response.end();
        });
    })
    .catch(error => {
        console.error(`Error while getting location coordinates: ${error}`);
        response.end();
    });
});

app.get('/get-weather-forecast-data/:appid/:units', (request, response) => {
    const city = 'Cape Town';
    axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${encodeURI(city)}&limit=1&appid=${request.params.appid}`)
    .then(locationResponse => {
        axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${locationResponse.data[0].lat}&lon=${locationResponse.data[0].lon}&units=${request.params.units}&appid=${request.params.appid}`)
        .then(res => {
            response.json(res.data);
        })
        .catch(error => {
            console.error(`Error getting weather data: ${error}`);
            response.end();
        });
    })
    .catch(error => {
        console.error(`Error while getting location coordinates: ${error}`);
        response.end();
    });
});

const port = process.env.PORT ? process.env.PORT : 8080;
app.listen(port, () => console.log(`The Weather App is running on http://localhost:${port}`));