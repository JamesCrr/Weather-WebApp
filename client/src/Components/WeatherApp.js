import React from "react"
import axios from 'axios';
import CurrentWeather from "./CurrentWeather"

class WeatherApp extends React.Component {
    constructor() {
        super()
        
        this.state = {
            weatherData : null,
            tempRepresentation: "c",
            errorMessage: ""
        }
        this.fetchCurrentWeather = this.fetchCurrentWeather.bind(this);
    }
    
    setTempRepresentation = (event) => {
        // event.preventDefault()
        this.setState({
            tempRepresentation: event.target.value
        })
    }
    
    async fetchCurrentWeather(event, strCity) {
        if (event !== null)
            event.preventDefault()
        const city = strCity
        // const country = strCountry
        // Construct POST JSON
        const postData = {
            cityName: city
        }
        axios.post('api/weather', postData)
          .then((res) => {
              console.log(res.data);
            if (!res.data.main) {
                this.weatherDataReceived(null)
                return null
            }
            const newData = res.data
            this.weatherDataReceived(newData)
            return newData;
          })
          .catch(err => {
            console.log(err)
          });
    }
    weatherDataReceived = (apiData) => {
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
    }

    render() {
        return (
            <div>
                <CurrentWeather weatherData={this.state.weatherData}
                    fetchWeatherFunc={this.fetchCurrentWeather}
                    errorMsg={this.state.errorMessage} 
                    tempRepresentation={this.state.tempRepresentation}
                    setTempRepresentationFunc={this.setTempRepresentation}
                />
                <p style={{height:"100vh", backgroundColor:"red"}}>Bla bla bla</p>
            </div>
        )
    }
}

export default WeatherApp