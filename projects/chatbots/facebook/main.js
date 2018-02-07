'use strict';
var express = require('express');
var morgan = require('morgan');
var session = require('express-session');
var cookieParser = require("cookie-parser");
var path = require('path');

var clientPath = path.resolve(__dirname, "client");
var http = require("http");
var bodyParser = require('body-parser');

var ejs = require("ejs");
var config = require('./config');
var favicon = require('serve-favicon');
var logger = require('morgan');

var venulyticsHandler = require("./routers");
/*============Initialize and COnfiguration===============*/

const app = express();
const demo = config.demo_mode;
app.use(logger('dev'));

if (demo) { console.log(' ======IN DEMO MODE========='); }


app.use(bodyParser.json({ limit: '50mb' }));
app.set('view engine', 'ejs');


/* ----------  Static Assets  ---------- */
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico'))); // eslint-disable-line

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

app.use('/venuelytics', venulyticsHandler)
app.all("/", function (req, res) {
    res.status(200).sendFile(path.join(__dirname, "/views/index.html"));
});

/* ----------  Errors  ---------- */

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
  
  /**
   * development error handler
   * will print stacktrace
   */
  if (app.get('env') === 'development') {
    app.use((err, req, res) => {
      res.status(err.status || 500);
      new Error(err); // eslint-disable-line no-new
    });
  }
  
  /**
   * production error handler
   * no stacktraces leaked to user
   */
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {},
    });
  });
  
app.listen(config.getPort());

console.log('Express server listening on port: ' + config.getPort());

