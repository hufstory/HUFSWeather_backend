var express = require('express');
const router = express.Router();
const path = require('path');
var Axios = require('axios');
const cors = require('cors');
const config = require('./api.js');
router.use(cors());

/* GET home page. */
router.get('/', function (req, res){
    // var url = `https://api.openweathermap.org/data/2.5/weather?lat=37.336414&lon=127.268979&lang=kr&appid=${config.api}&units=metric`
    var url = `https://api.openweathermap.org/data/2.5/forecast?lat=37.336414&lon=127.268979&appid=${config.api}&units=metric` // 3hours 5day api url
    console.log(url);
    var temp = [];
    var feel_temp = [];
    var temp_min = [];
    var temp_max = [];
    var humidity = [];
    var weather = [];
    var weather_detail = [];
    var weather_icon = [];
    var wind_speed = [];
    var time = [];
    Axios.get(url)
    .then(result => {
        const data = result.data;
        var send_message_list = [];
        data.list.forEach((data) => {
            var send_message = {
                temp: data.main.temp, //기온
                feel_temp: data.main.feels_like,//체감온도
                temp_min: data.main.temp_min,//최저기온
                temp_max: data.main.temp_max,//최고기온
                humidity: data.main.humidity,//습도
                weather: data.weather[0].main,//날씨
                weather_detail: data.weather[0].description,//상세날씨
                weather_icon: data.weather[0].icon,//그림
                wind_speed: data.wind.speed,//풍속
                time: data.dt_txt//시간
            };
            send_message_list.push(send_message);
          });
        res.json(send_message_list);
    })
    .catch(e=>{
        // handle error
        console.log(e);

      });
});

module.exports = router;