var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('express-handlebars');
var ejs = require('ejs');
var expressValidator = require('express-validator');
var session = require('express-session');
const config = require('./config');
const brcypt = require('bcryptjs')
const flash = require('connect-flash');
var app = express();
app.engine('ejs', require('ejs-locals'));
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


// Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  }));
  
  // Express Messages Middleware
  app.use(flash());
  app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
  });


// Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
  }));





  // Passport Config
// Passport init
app.use(passport.initialize());
app.use(passport.session());
app.get('*', function(req, res, next){
    res.locals.user = req.user || null;
    next();
  });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressValidator());

app.use(cookieParser());
app.use(cookieParser('secretString'));
app.use(session({cookie: { maxAge: 60000 }}));
//app.use(expressSession({cookie: { maxAge: 60000 }}));//new added for flash
app.use(express.static(path.join(__dirname, 'public')));


var users = require('./routes/users');
var dashboard = require('./routes/dashboard');
var dna = require('./routes/dna');
app.use('/', users);
app.use('/dashboard', dashboard);
app.use('/dna', dna);


/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found.');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        console.log(err);
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
      res.status(err.status || 500);

    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(5000, () => console.log('Listening on port 5000'));

module.exports = app;

