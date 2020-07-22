import React from "react"
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
        const API_KEY = process.env.REACT_APP_OPENWEATHERKEY;
        // const country = strCountry
        const apiData = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${API_KEY}`)
          .then((res) => {
            if (!res.ok) {
                return null;
            }
            res = res.json()
            return res;
          })
        
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