console.log('Program Start');

var async = require('async');
async.parallel([
    function (callback) {
        setTimeout(function () {
            console.log('First Step --> ');
            callback(null, '1');
        }, 3000);
    },
    function (callback) {
        console.log('Second Step --> ');
        callback(null, '2');
    },
    function (callback) {
        setTimeout(function () {
            console.log('Thrid Step --> ');
            callback(null, '3');
        }, 1000);
    }
],
function (err, result) {
    console.log(result);
});

console.log('Program End');
