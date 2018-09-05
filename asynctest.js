
var async = require('async');



async.waterfall([
  function (done) {
  
  setTimeout(function(){  console.log("Hello");   }, 8000);
  
var a=5*5*65-45*45;
var b1='test';
    done(null, a,b1);
  },
  function (value1,f, done) {
      console.log(f);
   var b=value1+5842;
    done(null, b);
  }, function (value2, done) {
   var c=value2*2;
    done(null, c);
  },
  function (value3, done) {
    console.log(value3);
    done(null, 'done');
  }

], function (err) {
  if (err) throw new Error(err);
});
