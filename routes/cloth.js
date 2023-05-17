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
            오늘의 전반적인 날씨는 ${message.weather_current.weather_main}이고 최소기온은 ${message.weather_whole.firstday.minTemp}이고 최고기온은 ${message.weather_whole.firstday.maxTemp}이다.\
            ${message.weather_times.list[0].time}에 기온은 ${message.weather_times.list[0].temp}이고 날씨는 ${message.weather_times.list[0].weather_main},\
            풍속은 ${message.weather_times.list[0].wind_speed}, 체감온도는 ${message.weather_times.list[0].feel_temp}이다. 습도는 ${message.weather_times.list[0].humidity}.
            ${message.weather_times.list[1].time}에 기온은 ${message.weather_times.list[1].temp}이고 날씨는 ${message.weather_times.list[1].weather_main},\
            풍속은 ${message.weather_times.list[1].wind_speed}, 체감온도는 ${message.weather_times.list[1].feel_temp}이다. 습도는 ${message.weather_times.list[1].humidity}.
            ${message.weather_times.list[2].time}에 기온은 ${message.weather_times.list[2].temp}이고 날씨는 ${message.weather_times.list[2].weather_main},\
            풍속은 ${message.weather_times.list[2].wind_speed}, 체감온도는 ${message.weather_times.list[2].feel_temp}이다. 습도는 ${message.weather_times.list[2].humidity}.
            ${message.weather_times.list[3].time}에 기온은 ${message.weather_times.list[3].temp}이고 날씨는 ${message.weather_times.list[3].weather_main},\
            풍속은 ${message.weather_times.list[3].wind_speed}, 체감온도는 ${message.weather_times.list[3].feel_temp}이다. 습도는 ${message.weather_times.list[3].humidity}.
            ${message.weather_times.list[4].time}에 기온은 ${message.weather_times.list[4].temp}이고 날씨는 ${message.weather_times.list[4].weather_main},\
            풍속은 ${message.weather_times.list[4].wind_speed}, 체감온도는 ${message.weather_times.list[4].feel_temp}이다. 습도는 ${message.weather_times.list[4].humidity}. 
             `},
            {
                role:"system",
                content: "내가 기상정보를 담고있는 메시지를 보내면, 너는 기상상황을 받아서 날씨와 기온, 최소기온, 최고기온, 풍속, 체감온도, 습도에 맞는 옷을 추천해주는 시스템이고 \
                출력은 한국말로 출력하고 날씨와 기온, 최소기온, 최고기온, 풍속, 체감온도, 습도정보는 출력하지 말고 내가 어떤 옷을 입어야 좋을지 추천 옷만 출력해줘"
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
    module.exports = router;