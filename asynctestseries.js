console.log('Program Start');

var async = require('async');
async.series([
    function (callback) {
        console.log('First Step --> ');
       
      //  setTimeout(function(){  console.log("Hello");   }, 8000);
        callback(null, a);
    },
    function (callback) {
        
        console.log('Second Step --> ');
        callback(null, '2');
    }
],
function (err, result) {
    console.log(result);
});

console.log('Program End');
