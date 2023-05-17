var express = require('express');
const router = express.Router();
var Axios = require('axios');
const cors = require('cors');
const config_chatgpt = require('../keys/openai_api.js');//api_key - chatgpt
const { Configuration, OpenAIApi } = require('openai'); //openai

router.use(cors());
const configuration = new Configuration({
    organization: "org-CsLVFqxc2fo6CQj983AaTZav",
    apiKey: config_chatgpt.api,
});
const openai = new OpenAIApi(configuration);

var message = {};
router.get('/', async (req, res) => {
    try {
        var url_weather = "http://localhost:3001/weather"

        const reponse3 = await Axios.get(url_weather)
            .then(result => {
                message = result.data;
            })
        console.log(message)
        const response_openai = await openai
            .createChatCompletion({
                model: "gpt-3.5-turbo",
                temperature : 0.5,
                messages: [{
                    role: "user", content: `
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
            ${message.weather_times.list[5].time}에 기온은 ${message.weather_times.list[5].temp}이고 날씨는 ${message.weather_times.list[5].weather_main},\
            풍속은 ${message.weather_times.list[5].wind_speed}, 체감온도는 ${message.weather_times.list[5].feel_temp}이다. 습도는 ${message.weather_times.list[5].humidity}.
            ${message.weather_times.list[6].time}에 기온은 ${message.weather_times.list[6].temp}이고 날씨는 ${message.weather_times.list[6].weather_main},\
            풍속은 ${message.weather_times.list[6].wind_speed}, 체감온도는 ${message.weather_times.list[6].feel_temp}이다. 습도는 ${message.weather_times.list[6].humidity}.
            ${message.weather_times.list[7].time}에 기온은 ${message.weather_times.list[7].temp}이고 날씨는 ${message.weather_times.list[7].weather_main},\
            풍속은 ${message.weather_times.list[7].wind_speed}, 체감온도는 ${message.weather_times.list[7].feel_temp}이다. 습도는 ${message.weather_times.list[7].humidity}.
             `},
                {
                    role: "system",
                    content: "내가 기상정보를 담고있는 메시지를 보내면, 너는 기상상황을 받아서 날씨와 기온, 최소기온, 최고기온, 풍속, 체감온도, 습도에 맞는 옷을 추천해주는 시스템이고 \
                출력은 한국말로 출력하고 날씨와 기온, 최소기온, 최고기온, 풍속, 체감온도, 습도정보는 출력하지 말고 내가 어떤 옷을 입어야 좋을지 추천 옷만 출력해줘\
                아우터가 필요한지 상의는 긴팔이 좋을지 반팔이 좋을지, 바지는 어떠한 바지가 좋을지 등등 추천해줘"
                },
                {
                    role: "assistant",
                    content: `오늘의 추천 코디는 날씨가  ${message.weather_current.weather_main}이므로`
                }
                ]
                
            })
        gptmessage = {
            gptmessage: response_openai.data.choices[0].message.content,
        };
        res.json(gptmessage)

    } catch (error) {
        console.error(error);
    }
})
module.exports = router;