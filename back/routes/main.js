var express = require('express');
const router = express.Router();
const path = require('path');
var Axios = require('axios');
const cors = require('cors');
const config = require('../keys/api');//api_key - openweathermap
const config_chatgpt = require('../keys/openai_api');//api_key - chatgpt
const { Configuration, OpenAIApi } = require('openai'); //openai
router.use(cors());

const configuration = new Configuration({
    organization: "org-CsLVFqxc2fo6CQj983AaTZav",
    apiKey: config_chatgpt.api,
});
const openai = new OpenAIApi(configuration);
/* GET home page. */
router.get('/', function (req, res){
    // var url = `https://api.openweathermap.org/data/2.5/weather?lat=37.336414&lon=127.268979&lang=kr&appid=${config.api}&units=metric`
    var url = `https://api.openweathermap.org/data/2.5/forecast?lat=37.336414&lon=127.268979&appid=${config.api}&units=metric` // 3hours 5day api url
    Axios.get(url)
    .then(result => {
        const data = result.data;
        var send_message_list = [];//json
        var sex = 'male'
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
        openai
        .createChatCompletion({
            model: "gpt-3.5-turbo",
            messages:[{role:"user", content:`
            Weather information for the time of ${send_message_list[0].time} is as follows
            temperatures : ${send_message_list[0].temp}
            sensory temperature : ${send_message_list[0].feel_temp}
            minimum temperature : ${send_message_list[0].temp_min}
            maximum temperature${send_message_list[0].temp_max}
            humidity : ${send_message_list[0].humidity}
            weather : ${send_message_list[0].weather}
            weather description : ${send_message_list[0].weather_detail}
            wind speed : ${send_message_list[0].wind_speed}
            Weather information for the time of ${send_message_list[1].time} is as follows
            temperatures : ${send_message_list[1].temp}
            sensory temperature : ${send_message_list[1].feel_temp}
            minimum temperature : ${send_message_list[1].temp_min}
            maximum temperature${send_message_list[1].temp_max}
            humidity : ${send_message_list[1].humidity}
            weather : ${send_message_list[1].weather}
            weather description : ${send_message_list[1].weather_detail}
            wind speed : ${send_message_list[1].wind_speed}
            Weather information for the time of ${send_message_list[2].time} is as follows
            temperatures : ${send_message_list[2].temp}
            sensory temperature : ${send_message_list[2].feel_temp}
            minimum temperature : ${send_message_list[2].temp_min}
            maximum temperature${send_message_list[2].temp_max}
            humidity : ${send_message_list[2].humidity}
            weather : ${send_message_list[2].weather}
            weather description : ${send_message_list[2].weather_detail}
            wind speed : ${send_message_list[2].wind_speed}
            Weather information for the time of ${send_message_list[3].time} is as follows
            temperatures : ${send_message_list[3].temp}
            sensory temperature : ${send_message_list[3].feel_temp}
            minimum temperature : ${send_message_list[3].temp_min}
            maximum temperature${send_message_list[3].temp_max}
            humidity : ${send_message_list[3].humidity}
            weather : ${send_message_list[3].weather}
            weather description : ${send_message_list[3].weather_detail}
            wind speed : ${send_message_list[3].wind_speed}
            Weather information for the time of ${send_message_list[4].time} is as follows
            temperatures : ${send_message_list[4].temp}
            sensory temperature : ${send_message_list[4].feel_temp}
            minimum temperature : ${send_message_list[4].temp_min}
            maximum temperature${send_message_list[4].temp_max}
            humidity : ${send_message_list[4].humidity}
            weather : ${send_message_list[4].weather}
            weather description : ${send_message_list[4].weather_detail}
            wind speed : ${send_message_list[4].wind_speed}
    
            please answer in korean
            `},
            {
                role:"system",
                content: "You are a system that recommends clothes to me according to the weather information I send you.\
                Please recommend clothes suitable for this weather by synthesizing and analyzing the weather information"
            }
        ]
        })
        .then(gpt_message=>{
            send_message_list.push(gpt_message.data.choices[0].message.content);
            res.json(send_message_list);
        })

    })
    .catch(e=>{
        // handle error
        console.log(e);
      });
});

module.exports = router;