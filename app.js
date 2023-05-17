var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
const cors = require("cors");
var mysql = require("mysql");
var mainRouter = require("./routes/main");
// var mysqlkey = require('./keys/databasekey');
var app = express();

const http = require("http").createServer(app);
http.listen(3001, function () {
  console.log("http://localhost:3001");
});
// var connection = mysql.createConnection({//연결할 테이블 DB
//   host    : mysqlkey.host,
//   user    : mysqlkey.user,
//   password: mysqlkey.password,
//   database: mysqlkey.database
// });

// connection.connect();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/weather", mainRouter);
app.use("/clothes", clothRouter);

module.exports = app;
