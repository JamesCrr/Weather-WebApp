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
            gottenWeatherData: false
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.fiveDayWeatherData !== this.props.fiveDayWeatherData) {
          if (this.props.fiveDayWeatherData === null) {
            return;
          }
          else {
            this.constructChartData()
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
            <div style={{height:"100vh", backgroundColor:"white"}}>
                {chart}
            </div>
        )
    }
}
export default WeatherDetails