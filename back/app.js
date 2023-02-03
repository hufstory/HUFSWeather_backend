var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const cors = require('cors');
var mysql = require('mysql');
var weatherRouter = require('./routes/weather');
var mainRouter = require('./routes/main');
var mysqlkey = require('./routes/api');
var app = express();

var connection = mysql.createConnection({//연결할 테이블
  host    : mysqlkey.host,
  user    : mysqlkey.user,
  password: mysqlkey.password,
  database: mysqlkey.database
});

connection.connect();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.get('/', function(req, res){
  var sql = 'SELECT id FROM coordinator'
    connection.query(sql, function(err, topics, fields){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        else{
            res.send(topics);
        }
    })
})


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/hufsweather', mainRouter, weatherRouter);
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
