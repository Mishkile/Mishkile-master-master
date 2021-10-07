var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var session = require('express-session')
var store = new session.MemoryStore();
var minute = 1000 * 60;
var hour = minute * 60
var mongoose = require('mongoose');




//express session setup


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
var createMoviesRouter = require('./routes/createMovie')
var searchShowsRouter = require('./routes/searchShows')
var mainMenuRouter = require('./routes/main')
// var menuRouter = require('./routes/menu')

var app = express();

// connection to database
mongoose.connect('mongodb://localhost:27017/persons')
  .then(res => {
    console.log('CONNECTION established');

  })
console.log('waiting for db')
// app.use(session({
//   secret: 'secret-key',
//   reserve: false,
//   saveUninitialized: false,
// }))
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'secretsome',
  cookie: { maxAge: hour },
  saveUninitialized: false,
  store
}))


// middleware
app.use((req, res, next) => {
  // checks if session is still alive, if not, it will log out.
  if (!req.session) {
    res.redirect('/login')
  } else if (req.session.credits < 1 || typeof req.session.credits == 'undefined') { // check if user have enough credits, when reached 0 it will log out.
    req.session.authenticated = false;
  } else if (typeof req.session.authenticated == false) {
    res.redirect('/login')
  }
  if (req.session.authenticated) {
    req.session.credits -= 1;
  }
  console.log(`${req.mthod} - ${req.url}`)
  next();
});


app.use('/', indexRouter);
app.use('/menu', mainMenuRouter);
app.use('/newUser', usersRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/createMovie', createMoviesRouter);
app.use('/users', usersRouter);
app.use('/searchShow', searchShowsRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  if (req.session.authenticated && req.session.user.admin) {
    res.status(404).render('index', { msg: "404, page not found", admin: true })

  } else if (req.session.authenticated && !req.session.user.admin) {
    res.status(404).render('index', { msg: "404, page not found", admin: false })

  } else {
    res.status(404).render('index', { msg: "404, page not found", admin: undefined })

  }
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
