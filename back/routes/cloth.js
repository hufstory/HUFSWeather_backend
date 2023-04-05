var express = require('express');
const router = express.Router();
var Axios = require('axios');
const cors = require('cors');
const config = require('../keys/api.js');//api_key - openweathermap
const config_chatgpt = require('../keys/openai_api.js');//api_key - chatgpt
const { Configuration, OpenAIApi } = require('openai'); //openai

router.use(cors());
const configuration = new Configuration({
    organization: "org-CsLVFqxc2fo6CQj983AaTZav",
    apiKey: config_chatgpt.api,
});
const openai = new OpenAIApi(configuration);
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
router.get('/', async (req, res) => {
    try {
        console.log(message);
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
                for(var i=0; i<5; i++)
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
                    };
                    days.push(date);
                      }
                    let minTemp = list.main.temp_min;
                    let maxTemp = list.main.temp_max;
                    if (minTemp < weather_whole[date].minTemp) {
                        weather_whole[date].minTemp = minTemp;
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

        const response_openai = await openai
        .createChatCompletion({
            model: "gpt-3.5-turbo",
            messages:[{role:"user", content:`
            today weather is ${message.weather_current.weather_main} and The lowest temperature is ${message.weather_current.temp_min} and the highest temperature is ${message.weather_current.temp_max}.\
            At ${message.weather_times.list[0].time}, the temperature is ${message.weather_times.list[0].temp}, the weather is ${message.weather_times.list[0].weather_main},\
             the wind speed is ${message.weather_times.list[0].wind_speed}, and the sensory temperature is ${message.weather_times.list[0].feel_temp}. The humidity is ${message.weather_times.list[0].humidity}.
             At ${message.weather_times.list[1].time}, the temperature is ${message.weather_times.list[1].temp}, the weather is ${message.weather_times.list[1].weather_main},\
             the wind speed is ${message.weather_times.list[1].wind_speed}, and the sensory temperature is ${message.weather_times.list[1].feel_temp}. The humidity is ${message.weather_times.list[1].humidity}.
             At ${message.weather_times.list[2].time}, the temperature is ${message.weather_times.list[2].temp}, the weather is ${message.weather_times.list[2].weather_main},\
             the wind speed is ${message.weather_times.list[2].wind_speed}, and the sensory temperature is ${message.weather_times.list[2].feel_temp}. The humidity is ${message.weather_times.list[2].humidity}.
             At ${message.weather_times.list[3].time}, the temperature is ${message.weather_times.list[3].temp}, the weather is ${message.weather_times.list[3].weather_main},\
             the wind speed is ${message.weather_times.list[3].wind_speed}, and the sensory temperature is ${message.weather_times.list[3].feel_temp}. The humidity is ${message.weather_times.list[3].humidity}.
             At ${message.weather_times.list[4].time}, the temperature is ${message.weather_times.list[4].temp}, the weather is ${message.weather_times.list[4].weather_main},\
             the wind speed is ${message.weather_times.list[4].wind_speed}, and the sensory temperature is ${message.weather_times.list[4].feel_temp}. The humidity is ${message.weather_times.list[4].humidity}.
    
            please answer in korean
            `},
            {
                role:"system",
                content: "You are a system that recommends clothes to me according to the weather information JSON I send you.\
                Please recommend clothes suitable for this weather by synthesizing and analyzing the weather information"
            }
        ]
        })
        gptmessage = {
            gptmessage : response_openai.data.choices[0].message.content,
        };
        res.json(gptmessage)

        } catch (error) {
          console.error(error);
        }
})
module.exports = router