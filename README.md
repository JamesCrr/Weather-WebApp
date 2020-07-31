# Fullstack Weather App
A Fullstack Application that provides weather forecasts of a specific area along with changing background images to reflect the current weather. Purpose of this was to learn more about creating fullstack applications and deploying it.\
Hosted [here](https://webforecast.herokuapp.com) on Heroku.\
**NOTE:** Initial startup of page might take a few minutes due to Heroku's free [dynos](https://www.heroku.com/dynos) plan

## Installation
### Setup
Download the project or<br /> Clone using
```
git clone https://github.com/JamesCrr/Weather-WebApp.git
```
### Install required packages
Make sure you have npm installed and run the following command to install package dependencies
```
npm install
``` 
### Create your .env file 
The server performs 2 API Calls to [OpenWeatherMap](https://openweathermap.org/) for the weather data, as well as [Unsplash](https://unsplash.com/) for Images.<br />
Both API calls require their unique API Key which are stored in the .env file. The names of the env variables are as follow
```
REACT_APP_OPENWEATHERKEY = Your OpenWeatherMap API Key
REACT_APP_UNSPLASHKEY = Your Unsplash API Key
```
### Run on Local machine
Start up the Server first
```
npm run server
```
Run the Client afterwards
```
npm run client
```