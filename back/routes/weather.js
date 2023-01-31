var express = require('express');
var router = express.Router();
var Axios = require('axios');
const config = require('./api.js');

/* GET home page. */
router.get('/getWeather', async function (req, res) {
  var url = `https://api.openweathermap.org/data/2.5/weather?lat=37.336414&lon=127.268979&lang=kr&appid=${config.api}&units=metric`
  console.log(url)
try {  let weatherRes = await Axios.get(
    url 
);
var weather = weatherRes.data.weather[0];//weather 객체
var temp = weatherRes.data.main.temp;//현재온도
var pressure = weatherRes.data.main.pressure;//기압
var humidity = weatherRes.data.main.humidity;//습도 
var temp_min = weatherRes.data.main.temp_min;//최저기온
var temp_max = weatherRes.data.main.temp_max;//최고기온
var windSpeed = weatherRes.data.wind.speed;//풍속
var windDeg = weatherRes.data.wind.deg;//풍향
var cloud = weatherRes.data.clouds.all;//구름양
var sunrise = weatherRes.data.sys.sunrise;
var sunset = weatherRes.data.sys.sunset;
console.log(weather);
console.log(temp);
console.log(pressure);
console.log(humidity);
console.log(temp_min);
console.log(temp_max);
console.log(windSpeed);
console.log(windDeg);
console.log(cloud);

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
console.log(Unix_timestamp(sunrise));//일출시간
console.log(Unix_timestamp(sunset));//일몰시간
return res.render('index', {
  weather:weather,
  temp:temp,
  pressure:pressure,
  humidity:humidity,
  temp_min:temp_min,
  temp_max:temp_max,
  windSpeed:windSpeed,
  windDeg:windDeg,
  cloud:cloud,
  sunrise:Unix_timestamp(sunrise),
  sunset:Unix_timestamp(sunset)})
}
catch(e){ 
  res.status(500).send("error" + e);
  return res.json(e)
}
});
router.get('/designer', function(req, res){
  res.render('designer');
})
module.exports = router;