import React from "react"
import axios from 'axios';
import CurrentWeather from "./CurrentWeather"
import WeatherDetails from "./WeatherDetails"

class WeatherApp extends React.Component {
    constructor() {
        super()
        
        this.state = {
            weatherData : null,
            weather5DayData: null,
            tempRepresentation: "c",
            errorMessage: ""
        }
        this.fetchCurrentWeather = this.fetchCurrentWeather.bind(this);
        this.detailsRef = React.createRef()
    }
    
    componentDidMount() {
        // Get current Location

        // If unable, set default Location
        this.fetchCurrentWeather(null, "Auckland")
    }

    setTempRepresentation = (event) => {
        event.preventDefault()
        this.setState({
            tempRepresentation: event.target.value
        })
    }

    expandMoreButtonPressed = (event) => {
        event.preventDefault()
        // Scroll downwards
        window.scrollTo(0, this.detailsRef.current.offsetTop)
    }
    
    async fetchCurrentWeather(event, strCity) {
        if (event !== null)
            event.preventDefault()
        
        // Construct POST JSON
        const city = strCity
        // const country = strCountry
        const postData = {
            cityName: city
        }
        axios.post('api/weather', postData)
          .then((res) => {
            // console.log(res.data);
            if (!res.data.main) {
                this.currentWeatherDataReceived(null)
                return null
            }
            const newData = res.data
            this.currentWeatherDataReceived(newData)
            return newData;
          })
          .catch(err => {
            console.log(err)
          });
    }
    currentWeatherDataReceived = (apiData) => {
        if (apiData === null) {
            this.setState({
                // weatherData : null,
                errorMessage: "Please enter a valid City"
            })
            return
        }
        this.setState({
            weatherData: apiData,
            errorMessage: ""
        })
        console.log(apiData)
        // Fetch the 5 day Data for valid City
        this.fetch5DayWeather(null, apiData.name)
    }

    async fetch5DayWeather(event, strCity) {
        if (event !== null)
            event.preventDefault()

        // Construct POST JSON
        const city = strCity
        // const country = strCountry
        const postData = {
            cityName: city
        }
        axios.post('api/weather5day', postData)
          .then((res) => {
            // console.log(res.data);
            if (!res.data.list) {
                this.fiveDayWeatherDataReceived(null)
                return null
            }
            const newData = res.data
            this.fiveDayWeatherDataReceived(newData)
            return newData;
          })
          .catch(err => {
            console.log(err)
          });
    }
    fiveDayWeatherDataReceived = (apiFiveDayData) => {
        if (apiFiveDayData === null) 
            return
        this.setState({
            weather5DayData: apiFiveDayData,
        })
        // console.log(apiFiveDayData)
    } 

    render() {
        return (
            <div>
                <CurrentWeather weatherData={this.state.weatherData}
                    fetchWeatherFunc={this.fetchCurrentWeather}
                    errorMsg={this.state.errorMessage} 
                    tempRepresentation={this.state.tempRepresentation}
                    setTempRepresentationFunc={this.setTempRepresentation}
                    expandMoreButtonPressed={this.expandMoreButtonPressed}
                />
                <div ref={this.detailsRef} ></div>
                <WeatherDetails weatherData={this.state.weatherData}
                    fiveDayWeatherData={this.state.weather5DayData}
                    tempRepresentation={this.state.tempRepresentation}
                />
            </div>
        )
    }
}

export default WeatherApp