console.log('Program Start');

var async = require('async');
async.auto({
    one: function (callback, arg1) {
        setTimeout(function () {
            console.log('First Step --> ' + JSON.stringify(arg1));
            callback(null, '1');
        }, 3000);
    },
    two: [
        'one', function (callback, arg1) {
            console.log('Second Step --> ' + JSON.stringify(arg1));
            callback(null, '2');
        }
    ],
    three: [
        function (callback) {
            console.log('thrid Step');
            callback(null, '3');
        }
    ]
},
    function (err, result) {
    console.log(result);
});

console.log('Program End');