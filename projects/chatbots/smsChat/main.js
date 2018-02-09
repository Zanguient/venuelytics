
var bodyParser = require('body-parser');
var express = require('express');
var morgan = require('morgan');
var session = require('express-session');
var cookieParser = require("cookie-parser");
var path = require("path");
var clientPath = path.resolve(__dirname, "client");
var router = require("./Routers/routes");
var app = express();
var http = require("http");
var ejs = require('ejs');
var port = process.env.PORT || 8000;


app.use(bodyParser.json({ limit: '50mb' }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Accept, Content-Type, Content-Length, Authorization, X-Requested-With, X-XSRF-TOKEN"
  );
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    console.log("OPTIONS SUCCESS");
    res.end();
  }
  next();
});

app.use('/smsbot', router)
app.all("*", function (req, res) {
  res.status(200).sendFile(path.join(__dirname, "/client/index.html"));
});

app.listen(port);
console.log('Express server listening on port ' + port);