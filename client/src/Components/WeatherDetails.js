import React from "react"
import "../CSS/WeatherDetails.css"
import ReactEcharts from "echarts-for-react";

class WeatherDetails extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            xAxisData: null,
            seriesData: null,
            weatherDates: null,
            gottenWeatherData: false,
            tempDetails: {
                temp: "0",
                feels_like: "0",
                min: "0",
                max: "0",
                pressure: "0",
                humidity: "0",
            }
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.fiveDayWeatherData !== this.props.fiveDayWeatherData) {
          if (this.props.fiveDayWeatherData === null) {
            return;
          }
          else {
            // Update Chart Data
            this.constructChartData()
            // Update Temperature Details
            let newTempDetails = {
                temp: "0",
                feels_like: "0",
                min: "0",
                max: "0",
                pressure: "0",
                humidity: "0",
            };
            let tempRepresentationStr = ""; 
            if (this.props.tempRepresentation === "c")
                tempRepresentationStr = " °C"
            else
                tempRepresentationStr = " °F"
            newTempDetails.temp = this.props.weatherData.main.temp + tempRepresentationStr
            newTempDetails.feels_like = this.props.weatherData.main.feels_like + tempRepresentationStr
            newTempDetails.min = this.props.weatherData.main.temp_min + tempRepresentationStr
            newTempDetails.max = this.props.weatherData.main.temp_max + tempRepresentationStr
            newTempDetails.pressure = this.props.weatherData.main.pressure
            newTempDetails.humidity = this.props.weatherData.main.humidity
            this.setState({
                tempDetails: newTempDetails
            })
          }
        }
    }

    // Construct new Chart when new Weather Data arrives
    constructChartData = () => {
        // Construct X-Axis
        const xAxisLength = 20
        const startingIndex = this.props.fiveDayWeatherData.list.length - xAxisLength
        var arrayIndex = 0 
        var newXAxisData = []
        var newWeatherDates = []
        for (var i = startingIndex; i < this.props.fiveDayWeatherData.list.length; ++i) {
            var dateStr = this.props.fiveDayWeatherData.list[i].dt_txt.split(" ");
            newWeatherDates[arrayIndex] = dateStr[0]
            dateStr = dateStr[1].split(":");
            newXAxisData[arrayIndex] = dateStr[0] + ":" + dateStr[1];
            arrayIndex++;
        }
        // Construct Series Data
        arrayIndex = 0
        var newSeriesData = []
        for (i = startingIndex; i < this.props.fiveDayWeatherData.list.length; ++i) {
            var temp = this.props.fiveDayWeatherData.list[i].main.temp;
            if (this.props.tempRepresentation === "c")
                temp = temp - 273.15
            else 
                temp = (temp - 273.15) * 9/5 + 32
            temp = temp.toFixed(2)
            newSeriesData[arrayIndex] = temp
            arrayIndex++;
        }

        // Change State
        this.setState({
            xAxisData: newXAxisData,
            seriesData: newSeriesData,
            weatherDates: newWeatherDates,
            gottenWeatherData: true
        })
    }
    // Fetch the Date for Chart
    getWeatherDate = (params) => {
        var dateStr = this.state.weatherDates[params.seriesData[0].dataIndex]   
        return (dateStr + ", " + params.value);
    }
    // For EChart's Handle
    getChartOptions = () => {
        // Get Representaion & Y Axis Interval
        var tempRepresentationStr = ""; 
        var yAxisInterval;
        if (this.props.tempRepresentation === "c") {
            tempRepresentationStr = "°C"
            yAxisInterval = 1
        }
        else {
            tempRepresentationStr = "°F"
            yAxisInterval = 6
        }

        return {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    }
                }
            },
            legend: {
                data: ['Temperature']
            },
            xAxis: {
                type: "category",
                data: this.state.xAxisData,
                axisPointer: {
                    label: {
                        formatter: (params) => this.getWeatherDate(params)
                    }
                }
            },
            yAxis: [
                {
                    type: "value",
                    interval: yAxisInterval,
                    axisLabel: {
                        formatter: "{value} " + tempRepresentationStr
                    }
                },
                // {
                //     type: 'value',
                //     axisLabel: {
                //         formatter: '{value} °C'
                //     }
                // }
            ],
            series: [
                { 
                    name: "Temperature",
                    type: "line",
                    symbolSize: 8,
                    data: this.state.seriesData
                }
            ]
        }
    }

    render() {

        let chart;
        if (this.state.gottenWeatherData)
            chart = <ReactEcharts className="chart" option={this.getChartOptions()}/>
        else 
            chart = <p></p>


        return (
            <div style={{minHeight:"100vh", backgroundColor:"white"}}>
                <div className="temp-details">
                    <h3 className="temp-actual">Temperature: {this.state.tempDetails.temp}</h3>
                    <h3 className="temp-feels-like">Feels Like: {this.state.tempDetails.feels_like}</h3>
                    <h3 className="temp-min">Min Temp: {this.state.tempDetails.min}</h3>
                    <h3 className="temp-max">Max Temp: {this.state.tempDetails.max}</h3>
                    <h3 className="pressure">Pressure: {this.state.tempDetails.pressure}</h3>
                    <h3 className="humidity">Humidity: {this.state.tempDetails.humidity}</h3>
                </div>

                <div className="chart-container">
                    {chart}
                </div>
            </div>
        )
    }
}
export default WeatherDetails