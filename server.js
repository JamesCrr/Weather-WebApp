const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

// Once Heroku is in production, 
// Serve the build folder
const publicPath = path.join(__dirname, 'client', 'build');
app.use(express.static("client/build"));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html')); // relative path
});

// Start listening
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server running on port: ${port}`)
})