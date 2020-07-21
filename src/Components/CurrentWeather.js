import React from "react"
import Unsplash from 'unsplash-js';
import InputDetails from "./InputDetails"
import "../Weather-icons/css/weather-icons.min.css"
import "../CSS/CurrentWeather.css"

class CurrentWeather extends React.Component {
    constructor(props) {
        super(props)

        let newDate = new Date()
        this.unsplashImgLength = 15
        this.prevImgID = 0
        this.unsplash = new Unsplash({ 
            accessKey: process.env.REACT_APP_UNSPLASHKEY
        });
        this.state = {
            dateStr: newDate.toLocaleDateString(),
            locationStr: "",
            tempIconID: 0,
            tempStr: "",
            unsplashImgURL: "",
            unsplashImgID: 0
        }
    }

    componentDidMount() {
        // Get current Location

        // If unable, set default Location
        this.props.fetchWeatherFunc(null, "Auckland")
    }

    componentDidUpdate(prevProps) {
        if (prevProps.weatherData !== this.props.weatherData) {
          if (this.props.weatherData === null) {
                this.setState({
                    locationStr: "",
                    tempIconID: 0,
                    tempStr: 0,
                })
          }
          else {
                var newTemp = this.props.weatherData.main.temp
                var tempIcon = ""
                if (this.props.tempRepresentation === "c"){
                    newTemp = newTemp - 273.15
                    tempIcon = "°C"
                }
                else{
                    tempIcon = "°F"
                }
                newTemp = newTemp.toFixed(2)
                newTemp = newTemp + "  " + tempIcon
                
                var weatherWord = this.props.weatherData.weather[0].main
                if (weatherWord == "Clear")
                    weatherWord = "Sky"
                this.unsplash.search.photos(weatherWord, 1, this.unsplashImgLength, { orientation: "landscape" })
                    .then(res => {
                        if (!res.ok)
                            throw Error(res.status)
                        res = res.json()
                        return res;
                    })
                    .then(resJSON => {
                        console.log(resJSON)
                        var randomID = Math.floor(Math.random() * this.unsplashImgLength);
                        if (randomID === this.state.unsplashImgID)
                            randomID++
                        var imgStr = resJSON.results[randomID].urls.regular
                        this.setState({
                            unsplashImgURL: imgStr,
                            unsplashImgID: randomID,
                        })
                        return imgStr;
                    })
                    .catch(err => {
                        console.log("Unsplash Error: " + err)
                    })               

                this.setState({
                    locationStr: this.props.weatherData.name + ", " + this.props.weatherData.sys.country,
                    tempIconID: this.props.weatherData.weather[0].id,
                    tempStr: newTemp,
                })
          }
        }
    }

    render() {
        return (
            <div className="current-weather-container" style={{backgroundImage:"url(" + this.state.unsplashImgURL + ")"}}>
                <h3 className="date">{this.state.dateStr}</h3>
                <h3 className="location">{this.state.locationStr}</h3>
                <div className="temp-container">
                    <i className={"wi wi-owm-"+this.state.tempIconID}></i>
                    <h3 className="actual-temp">{this.state.tempStr}</h3>
                </div>

                <InputDetails errorMsg={this.props.errorMsg} 
                    fetchWeatherFunc={this.props.fetchWeatherFunc}
                    tempRepresentation={this.props.tempRepresentation}
                    setTempRepresentationFunc={this.props.setTempRepresentationFunc}/>
            </div>
        )
    }
}

export default CurrentWeather;