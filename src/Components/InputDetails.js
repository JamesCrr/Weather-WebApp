import React from "react"
import { StylesProvider } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import "../CSS/InputDetails.css"

class InputDetails extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            city: "",

        }
    }

    onInputChange = (event) => {
        event.preventDefault()
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    onSubmitCity = (event) => {
        event.preventDefault()
        this.props.fetchWeatherFunc(event, this.state.city)
        this.setState({
            city: ""
        })
    }

    render() {
        return (
            <StylesProvider injectFirst>
            {/* City Name */}
            <form className="form" autoComplete="off" onSubmit={(e)=>this.onSubmitCity(e)}>
                <TextField className="city-field" value={this.state.city} onChange={this.onInputChange} name="city" label="City" size="small" variant="outlined" />
            </form>
            {/* Temp Details */}
            <FormControl className="cel-fahren-select" variant="outlined" size="small" hiddenLabel>
                <InputLabel>Type</InputLabel>
                <Select value={this.props.tempRepresentation}
                    onChange={(e) => this.props.setTempRepresentationFunc(e)}
                    label="Type"
                >
                    <MenuItem value="c">°C</MenuItem>
                    <MenuItem value="f">°F</MenuItem>
                </Select>
            </FormControl>

            <p className="error">{this.props.errorMsg === "" ? "" : "*"}{this.props.errorMsg}</p>
            <Button 
                className="submit-button"
                variant="contained" size="medium" color="primary"
                onClick={(e)=>this.onSubmitCity(e)}
            >Submit
            </Button>
            </StylesProvider>
        )
    }
}
export default InputDetails