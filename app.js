var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
const cors = require("cors");
var mainRouter = require("./routes/main");
var clothRouter = require("./routes/cloth");
var app = express();

const http = require("http").createServer(app);
http.listen(3001, function () {
  console.log("http://localhost:3001");
});


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
