const express = require("express");
const bodyParser = require("body-parser");
const axios = require('axios');
const path = require("path");
const dotenv = require("dotenv");
const Unsplash = require('unsplash-js').default;
const fetch = require('node-fetch');
global.fetch = fetch;

const app = express();
// Bodyparser middleware
app.use(
    bodyParser.urlencoded({
        extended: false
    })
    );
    app.use(bodyParser.json());
// Config .env file
dotenv.config();
// Unsplash Ref
const unsplashRef = new Unsplash({ 
    accessKey: process.env.REACT_APP_UNSPLASHKEY
});

// Once Heroku is in production, 
// Serve the build folder
const publicPath = path.join(__dirname, 'client', 'build');
app.use(express.static("client/build"));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html')); // relative path
});

// API Calls
app.post('/api/weather', function(req, res) {
    const cityName = req.body.cityName;
    const API_KEY = process.env.REACT_APP_OPENWEATHERKEY
    const fetchReq = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=${API_KEY}`
    axios.get(fetchReq)
        .then(response => {
            // console.log(response.data);
            res.send(response.data);
        })
        .catch(error => {
            // console.log(error);
            res.send(error);
        });
});
app.post('/api/weather5day', function(req, res) {
    const cityName = req.body.cityName;
    const API_KEY = process.env.REACT_APP_OPENWEATHERKEY
    const fetchReq = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&APPID=${API_KEY}`
    axios.get(fetchReq)
        .then(response => {
            // console.log(response.data);
            res.send(response.data);
        })
        .catch(error => {
            // console.log(error);
            res.send(error);
        });
});
app.post('/api/unsplash', function(req, res) {
    const imageKeyWord = req.body.word;
    const imagePages = 1
    const imagesPerPage = 15
    unsplashRef.search.photos(imageKeyWord, imagePages, imagesPerPage, { orientation: "landscape" })
        .then(response => {
            if (!response.ok)
                throw Error(response.status)
            response = response.json()
            return response
        })
        .then(resJSON => {
            res.send(resJSON)
        })
        .catch(err => {
            res.send(err)
        })
});

// Start listening
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server running on port: ${port}`)
})