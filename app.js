require("dotenv").config();
const express = require("express");
const https = require("https");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.render("home");
});

app.post("/", function(req, res) {
  let query =  req.body.cityName;
  const unit = "metric";
  const appKey = "" + process.env.API_KEY;
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + appKey + "&units=" + unit + "";
  https.get(url, function(response) {
    response.on("data", function(data) {
      if(response.statusCode === 200){
        const receievedData = JSON.parse(data);
        const temp = receievedData.main.temp;
        const humidity = receievedData.main.humidity;
        const weatherDes = receievedData.weather[0].description;
        const windspd = parseFloat(receievedData.wind.speed * 3.6).toFixed(2);
        const icon = receievedData.weather[0].icon
        const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
        query = receievedData.name;
        res.render("search", {city: query, temperature: temp, desc: weatherDes, humidityp: humidity, windspeed: windspd, add: imageURL});
      }else{
        const msg = query + ": City Not Found. Try Again.";
        res.render("error", {errorMsg : msg});
      }
    });
  });
});

app.listen(process.env.PORT || 3000, function() {
  console.log("The server is running on port 3000.");
});
