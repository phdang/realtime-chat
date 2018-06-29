var createError = require('http-errors');
var express = require('express');
var session = require('express-session')({
  secret: 'my-secret',
  resave: true,
  saveUninitialized: true
});
var sharedsession = require('express-socket.io-session');
var socket_io = require('socket.io');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();
// Socket.io
var io = socket_io();
app.io = io;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// add session
app.use(session);
app.use(function(req, res, next) {
  req.session.cookie.maxAge = 2 * 60 * 60 * 1000; // 2 hours
  next();
});
// Share session with io sockets
io.use(
  sharedsession(session, {
    autoSave: true
  })
);

app.use(express.static(path.join(__dirname, 'public')));
//Set global variable for views templating engine
app.use((req, res, next) => {
  res.locals.username = req.session.username;
  next();
});
//index routes
require('./routes/index')(app, io);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
