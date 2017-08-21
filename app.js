var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cors=require("cors");
const passport = require('passport');
var mongoose= require("mongoose");

//var favicon = require('serve-favicon');
//var logger = require('morgan');
//var cookieParser = require('cookie-parser');

var config=require('./config/database');

//var index = require('./routes/index');
var users = require('./routes/users');

// Connect To Database
mongoose.connect(config.database);

// On Connection
mongoose.connection.on('connected', () => {
  console.log('Connected to database '+config.database);
});

// On Error
mongoose.connection.on('error', (err) => {
  console.log('Database error: '+err);
});


var app = express();

// CORS Middleware
app.use(cors());


// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev')); 

// Body Parser Middleware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', index);
app.use('/users', users);

// Index Route
app.get('/', function(req, res) {
  res.send('Invalid Endpoint');
});

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

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
