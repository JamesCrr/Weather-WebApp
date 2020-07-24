import React from "react"
import axios from 'axios';
import { StylesProvider, styled } from "@material-ui/core/styles";
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import InputDetails from "./InputDetails"
import "../Weather-icons/css/weather-icons.min.css"
import "../CSS/CurrentWeather.css"

class CurrentWeather extends React.Component {
    constructor(props) {
        super(props)

        this.backgroundColorRef = React.createRef();
        this.MyIconButton = styled(IconButton)({
            '&:hover': {
                backgroundColor: "rgba(0, 0, 0, 0.801);",
            }
        });

        this.timerInterval = null
        let newDate = new Date()
        this.state = {
            dateStr: newDate.toLocaleDateString(),
            locationStr: "",
            tempIconID: 0,
            tempStr: "",
            unsplashImgURL: "",
            unsplashImgID: 0
        }
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
            this.newWeatherDataReceived()
            this.fadeToBlack_BackgroundImage()
          }
        }
    }

    // When we received new Weather Data from the API
    // and we need to update our State
    newWeatherDataReceived = () => {
        var newTemp = this.props.weatherData.main.temp
        var tempIcon = ""
        if (this.props.tempRepresentation === "c"){
            newTemp = newTemp - 273.15
            tempIcon = "°C"
        }
        else{
            newTemp = (newTemp - 273.15) * 9/5 + 32
            tempIcon = "°F"
        }
        newTemp = newTemp.toFixed(2)
        newTemp = newTemp + "  " + tempIcon
        this.setState({
            locationStr: this.props.weatherData.name + ", " + this.props.weatherData.sys.country,
            tempIconID: this.props.weatherData.weather[0].id,
            tempStr: newTemp,
        })
    }

    // Updates the Background Image with API Data
    updateBackgroundImage = () => {
        var weatherWord = this.props.weatherData.weather[0].main
        if (weatherWord === "Clear")
            weatherWord = "Sky"
        // Construct POST JSON
        const postData = {
            word: weatherWord
        }
        axios.post('api/unsplash', postData)
            .then(res => {
                // console.log(res.data)
                var randomID = Math.floor(Math.random() * res.data.results.length);
                if (randomID === this.state.unsplashImgID)
                    randomID = Math.floor(Math.random() * res.data.results.length)
                var imgStr = res.data.results[randomID].urls.regular
                this.setState({
                    unsplashImgURL: imgStr,
                    unsplashImgID: randomID,
                })
                return imgStr;
            })
            .catch(err => {
                console.log("Unsplash Error: " + err)
            })
        // Fade In Image again
        clearInterval(this.timerInterval)
        this.timerInterval = setInterval(this.fadeToBlack_BackgroundImage, 250)
    }
    // BG Animation
    fadeToBlack_BackgroundImage = () => {
        const bgColorDOM = this.backgroundColorRef.current;
        if (bgColorDOM.classList.contains("black")) {
            bgColorDOM.classList.remove("black")
            clearInterval(this.timerInterval)
            this.timerInterval=null;
        }
        else {
            if (this.timerInterval !== null){
                clearInterval(this.timerInterval)
                bgColorDOM.classList.remove("black")
            }
            // Fade out, then update Image
            this.timerInterval = setInterval(this.updateBackgroundImage, 350)
            bgColorDOM.classList.add("black")
        }
    }

    render() {
        return (
            <div className="current-weather-bg-img" style={{backgroundImage:"url(" + this.state.unsplashImgURL + ")"}}>
            <div className="current-weather-bg-color" ref={this.backgroundColorRef}>
                <div className="current-weather-content">
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

                <div>
                    <StylesProvider injectFirst>
                        <div className="expandMore-container">
                            <this.MyIconButton className="expandMore-button" onClick={this.props.expandMoreButtonPressed}>
                                <ExpandMoreIcon className="expandMore-icon"/>
                            </this.MyIconButton>
                        </div>
                    </StylesProvider>
                </div>    
            </div>
            </div>
        )
    }
}

export default CurrentWeather;