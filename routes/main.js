var express = require('express');
const router = express.Router();
const path = require('path');
var Axios = require('axios');
const cors = require('cors');
const config = require('../keys/api.js');//api_key - openweathermap
router.use(cors());


// 타임스탬프 값을 년월일로 변환
function Unix_timestamp(t){
    var date = new Date(t*1000);
    var year = date.getFullYear();
    var month = "0" + (date.getMonth()+1);
    var day = "0" + date.getDate();
    var hour = "0" + date.getHours();
    var minute = "0" + date.getMinutes();
    var second = "0" + date.getSeconds();
    return year + "-" + month.substr(-2) + "-" + day.substr(-2) + " " + hour.substr(-2) + ":" + minute.substr(-2) + ":" + second.substr(-2);
}
var message = {};
/* GET home page. */
router.get('/', async (req, res) => {
    try {
        var url_current = `https://api.openweathermap.org/data/2.5/weather?lat=37.336414&lon=127.268979&lang=kr&appid=${config.api}&units=metric`
        var url_3hour = `https://api.openweathermap.org/data/2.5/forecast?lat=37.336414&lon=127.268979&lang=kr&appid=${config.api}&units=metric` // 3hours 5day api url
        const response = await Axios.get(url_current)
        .then(result => {
            const data = result.data;   
            message.weather_current = {
                temp: data.main.temp,
                temp_max: data.main.temp_max,
                temp_min: data.main.temp_min,
                weather_main: data.weather[0].main,
                weather_description: data.weather[0].description,
                weather_icon: data.weather[0].icon
            }
        })
        const response2 = await Axios.get(url_3hour)
        .then(result => {
            const data = result.data;
            var weather_times = [];
            for(var i=0; i<8; i++)
                {
                var  weather_time_obj = {
                    temp: data.list[i].main.temp, //기온
                    feel_temp: data.list[i].main.feels_like,//체감온도
                    humidity: data.list[i].main.humidity,//습도
                    weather_main: data.list[i].weather[0].main,//날씨
                    weather_description: data.list[i].weather[0].description,//상세날씨
                    weather_icon: data.list[i].weather[0].icon,//그림
                    wind_speed: data.list[i].wind.speed,//풍속
                    time: Unix_timestamp(data.list[i].dt)//시간
                };
                weather_times.push(weather_time_obj);
                };
                message.weather_times = {
                    list : weather_times
                }
                var weather_whole = {};
                var weather_week ={};
                var days = [];
            data.list.forEach(function(list){
                var date = Unix_timestamp(list.dt).split(' ')[0];
                const D = new Date(date);
                const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                const dayOfWeek = D.getDay();
                if (!weather_whole[date]) {
                    weather_whole[date] = {
                        minTemp: Infinity, 
                        maxTemp: -Infinity,
                        day : "",
                        icon : "",
                        main : "",
                    };
                days.push(date);
                  }
                let minTemp = list.main.temp_min;
                let maxTemp = list.main.temp_max;
                if (minTemp < weather_whole[date].minTemp) {
                    weather_whole[date].minTemp = minTemp;
                    weather_whole[date].icon = list.weather[0].icon;
                    weather_whole[date].main = list.weather[0].main;
                }
                if (maxTemp > weather_whole[date].maxTemp) {
                    weather_whole[date].maxTemp = maxTemp;
                }
                weather_whole[date].day = weekdays[dayOfWeek];
                // Add the forecast data to the corresponding date array
            });
            weather_week = {
                firstday : weather_whole[days[0]],
                secondday : weather_whole[days[1]],
                thirdday : weather_whole[days[2]],
                fourthday : weather_whole[days[3]],
                fifthday : weather_whole[days[4]],
            }
            message.weather_whole = weather_week;
        });
    res.json(message)
}
    catch (error) {
      console.error(error);
    }
    });      
    module.exports = router