require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const flash = require('connect-flash');
var indexRouter = require('./routes/index');
var usersRouter = require('./models/users');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const store = new MongoStore({
  uri: process.env.DATABASE_CONNECTION_STRING, // Use the same connection string as the main database
  collection: 'sessions',
});

// Handle MongoStore errors
store.on('error', function (error) {
  console.error('Session store error:', error);
});

// Set up session middleware
app.use(
  session({
    secret: 'SECRET_PRINCE',
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: { secure: false, maxAge: 3600000 },
  })
);

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Flash middleware
app.use(flash());

// Make flash messages available in all views
app.use((req, res, next) => {
  res.locals.messages = req.flash(); // Make flash messages available in views
  next();
});

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
