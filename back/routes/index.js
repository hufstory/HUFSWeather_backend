var express = require('express');
var router = express.Router();
var Axios = require('axios');
/* GET home page. */
router.get('/getWeather', async function (req, res) {
  var today = new Date();
  var year = today.getFullYear();
  var month = ('0' + (today.getMonth() + 1)).slice(-2);
  var day = ('0' + today.getDate()).slice(-2);
  var hour = today.getHours() - 1;
  var dateString = year + '' + month + '' + day;
  var nx = 64;
  var ny = 122;
  var url = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst'
  var api = '';
  url += "?serviceKey=" + api;
  url += "&pageNo=1&numOfRows=7";
  url += "&dataType=JSON";
  url += "&base_date=" + dateString;
  url += "&base_time=" + hour-1 + "00";
  url += "&nx=" + nx + "&ny=" + ny;
  

try {  let movieRes = await Axios.get(
    url 
);
return res.json(movieRes.data);
}
catch(e){ 
  res.status(500).send("error" + e);
  return res.json(e)
}
});
module.exports = router;