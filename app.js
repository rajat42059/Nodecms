var express = require("express");
var path = require("path");
var favicon = require("static-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var hbs = require("express-handlebars");
var ejs = require("ejs");
var expressValidator = require("express-validator");
var session = require("express-session");
const config = require("./config");
const brcypt = require("bcryptjs");
const flash = require("connect-flash");
var multer = require("multer");

var app = express();

app.engine("ejs", require("ejs-locals"));
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

// Express Session Middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
  })
);

// Express Messages Middleware
app.use(flash());
app.use(function(req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

// Express Validator Middleware
app.use(
  expressValidator({
    errorFormatter: function(param, msg, value) {
      var namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value
      };
    }
  })
);

// Passport Config
// Passport init
app.use(passport.initialize());
app.use(passport.session());
app.get("*", function(req, res, next) {
  res.locals.user = req.user || null;
  next();
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(favicon());
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressValidator());

app.use(cookieParser());
app.use(cookieParser("secretString"));
app.use(session({ cookie: { maxAge: 60000 } }));
//app.use(expressSession({cookie: { maxAge: 60000 }}));//new added for flash
app.use(express.static(path.join(__dirname, "public")));

var users = require("./routes/users");
var dashboard = require("./routes/dashboard");
var dna = require("./routes/dna");
app.use("/", users);
app.use("/dashboard", dashboard);
app.use("/dna", dna);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found.");
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use(function(err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);

  res.render("error", {
    message: err.message,
    error: {}
  });
});

var serve = app.listen(5000, () => console.log("Listening on port 5000"));
const io = require("socket.io").listen(serve);

/* chat Implementation here  */
const connections = [];
onlineuser = [];
io.on("connection", function(socket) {
  connections.push(socket);


  io.sockets.emit("totaluser", { totaluser: connections.length - 1 }); ////increasing online user count

  console.log(" %s sockets is connected", connections.length);

  

  socket.on("disconnect", () => {
   var oldconnecteduser=socket.disconnecteduser
 
   oldconnecteduser.splice(oldconnecteduser.indexOf(socket.username),1);

    connections.splice(connections.indexOf(socket), 1);
    io.sockets.emit("totaluser", { totaluser: connections.length - 1 }); //decreasing online user count

    var connectionMessage = socket.username + " Disconnected from Socket " + socket.id;
console.log('d1')
   io.sockets.emit("totalonlineuser", { username: oldconnecteduser }); //emitting username
   console.log('d2')
  });

//online users
socket.on("onlineusers", data => {
 
  socket.username = data.username;
 
  var totaluser = onlineuser.push(data);
 // console.log(onlineuser);
  var array=onlineuser;
 
//filtering unique userid
  var unique = {};
  var distinct = [];
      for( var i in array ){
       if( typeof(unique[array[i].userid]) == "undefined"){
        distinct.push(array[i].username);
       }
       unique[array[i].userid] = 0;
      }

 socket.disconnecteduser = distinct;

  io.sockets.emit("totalonlineuser", { username: distinct }); //emitting username
});




  socket.on("msg", function(data) {
    //Send message to everyone
    //insert data here
    config.query(
      "insert into chats(user,message) values (?,?) ",
      [data.user, data.message],
      function(err, rows, fields) {
        if (err) console.log(err);
      }
    );

    //get chat here
    config.query("select user,message from chats", function(err, rows, fields) {
      io.sockets.emit("newmsg", data);
    });
  });

  socket.on("isTyping", data => {
    socket.broadcast.emit("typing", { username: data });
  });
});

/* chat Implementation ends here  */

module.exports = app;
