var express = require('express');
var router = express.Router();
var Axios = require('axios');
const config = require('./api.js');

/* GET home page. */
router.get('/getweather', async function (req, res){
  var url = `https://api.openweathermap.org/data/2.5/weather?lat=37.336414&lon=127.268979&lang=kr&appid=${config.api}&units=metric`
  console.log(url);
try {  let weatherRes = await Axios.get(
    url 
);

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

const alldata = [
{temp : weatherRes.data.main.temp}
,{pressure : weatherRes.data.main.pressure}
,{humidity : weatherRes.data.main.humidity}
,{temp_min : weatherRes.data.main.temp_min}
,{temp_max : weatherRes.data.main.temp_max}
,{speed : weatherRes.data.wind.speed}
,{deg : weatherRes.data.wind.deg}
,{all : weatherRes.data.clouds.all}
,{sunrise : Unix_timestamp(weatherRes.data.sys.sunrise)}
,{sunset : Unix_timestamp(weatherRes.data.sys.sunset)}
]
var weather = weatherRes.data.weather[0]

return res.json(alldata);

}
catch(e){ 
  res.status(500).send("error" + e);
}
});

router.get('/designer', function(req, res){
  res.render('designer');
})
module.exports = router;