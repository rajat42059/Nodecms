/*var events = require('events').EventEmitter;
var emitter = new events.EventEmitter();

emitter.on('newEvent', function(user){
    console.log(user);
});

emitter.emit('newEvent', "Krunal");

*/

 function square(x) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(Math.pow(x, 2));
    }, 2000);
  });
}





//square(10).then(data => {  console.log(data);});
/////////////////////////////////////////

async function layer(x)
{
  const value = await square(x);
  
  console.log(value);
  console.log('hello');
}

layer(5878);