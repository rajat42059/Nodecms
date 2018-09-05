var express = require('express');
var router = express.Router();

var db = require('../config.js');
let mysql = require('mysql');

var dna = require("../models/user");
let connection = mysql.createConnection(mysql);



exports.viewdna = (req, res, next) => {

  dna.viewdna(function (err, result) { 
     if (err) {
     console.log(err);      
    }
   res.render('dna', {data: result });
  })
};


//View  Modules
exports.viewmodule = (req, res, next) => {
  dna.viewmodule(function (err, result) { 
    if (err) {
    console.log(err);      
   }
   res.render('module', {  data: result  });
 })
 
};

//View  Modules
exports.addmodule = (req, res, next) => {

  var modulename=req.body.modulename;
  var modulecolor=req.body.modulecolor;
  req.checkBody('modulename', 'Name is required').notEmpty();
  req.checkBody('modulecolor', 'Email is required').notEmpty();

  let errors = req.validationErrors();
  if(errors){
    console.log(errors);
    res.render('module', {
      errors:errors
    });
  }
  else{

    dna.addmodule({
      modulename: modulename,
      modulecolor:modulecolor,    
    }, function (err, result) {
      if (err) {
        console.log(err);
      }
      else{
       var insert_id=result.insertId;
       var module_id=insert_id+100;
       db.query('UPDATE module SET module_id = '+module_id+' WHERE id = + '+insert_id+'');
        req.flash('success','New Module Added Sucessfully!');
     
        res.redirect('/module');
      }
    })    
  }
};


function deletemodule(id) {

  return new Promise(function(resolve, reject) {

      dna.deletemodule({//deleting Module
        id: id
      },function (err, result) {
        if(err) {
          reject(err);
        } 
       
        resolve(result);

      })
      
  })
}

function deletemoduledna(id) {
  return new Promise(function(resolve, reject) {

      dna.deletemoduledna({//deleting dna
        id: id
      },function (err, result) {
        if(err) {
          reject(err);
        } 
        resolve(result);

      })
      // business logic with result
  })

}

exports.deletemodule = async (req, res, next) => {
  var id = req.params.id;
  let data = await deletemodule(id);

  let data2 = '';

  if(data.affectedRows > 0) {
    data2  = await deletemoduledna(id);

  } else  {}
  req.flash('success', '<strong>Success!</strong> Module deleted sucessfully');
  res.redirect('/module');

};

/*
exports.deletemodule =  async (req, res, next) => {
 
  var promise = await new Promise(function(resolve,reject) {
    setTimeout(function(){  
        console.log("1");
     resolve("done");
    }, 5000);

  } )
  
  promise.then(console.log('2'));
};
*/

exports.ajaxdeletedna =   (req, res, next) => {
  var id = req.params.id;
  dna.deletedna({
    id: id
  }, function (err, result) {
    if (err) {
      res.json({"data":"0"})
    }
  else{
    //res.setHeader('content-type', 'application/json');
    res.json({"data":"1"})
  }
  })
 
};





//unused functions
exports.deletednadata = (req, res, next) => {
  var id = req.params.id;
  dna.deletedna({
    id: id
  }, function (err, result) {
    if (err) {
      throw new err;
    }
  else{
 console.log('success');
  }
  })
}

exports.filldropdown = (req, res, next) => {

  dna.viewmodule(function (err, result) {
    if (err) {
      console.log(err);
    }
  else{
 console.log(result);
 res.render('adddna',{rows:result,errors:'' });

  }
  })
}

exports.adddna = (req, res, next) => {
  var module_id = req.body.selectmodule;
  var dna_name = req.body.dnaname;


  req.checkBody('dnaname', 'dna_name is required').notEmpty();

  let errors = req.validationErrors();
  if(errors){

    dna.viewmodule(function (err, result) {

      res.render('adddna',{rows:result,errors:errors});
       })
  
 
   
  }
  else{
  dna.adddna({
    module_id:module_id,
    dna_name:dna_name
  },function (err, result) {

    
    if (err) {
      console.log(err);
    }
  else{
 
 res.redirect('/dna');

  }
  })
}
}





exports.viewdnamodule = (req, res, next) => {
  var id = req.params.id;

  dna.viewdnamodule({
    id: id
  }, function (err, result) {
    if (err) {
      throw new err;
    }
    console.log(result);
    res.render('dnalist',{data:result});
  })

};


exports.updatednamodule = (req, res, next) => {
  var id = req.params.id;
  var module_name = req.body.module_name;
  var module_color = req.body.module_color;

  dna.updatednamodule({
    id: id,
    module_name: module_name,
    module_color: module_color

  }, function (err, result) {
    if (err) {
    console.log(err);
    }
    req.flash('success','<strong>Success!</strong>Module Updated Sucessfully')
    res.redirect('/module');
  })

};

//edit module form opening
exports.editmodule = (req, res, next) => {
  var id = req.params.id;
console.log('helo');
  dna.editdnamodule({
    id: id
  }, function (err, result) {
    if (err) {
      console.log(err);
    }
 console.log(result);
   // req.flash('success','<strong>Success!</strong>DNA Updated Sucessfully')
    res.render('editmodule',{data:result});
  })

};


exports.showediteddna = (req, res, next) => {
  var id = req.params.id;

console.log('showediteddna');
dna.dnaformpopulated({
  id: id
}, function (err, result) {
  if (err) {
   console.log(err);
  }
  else{
    res.render('editdna',{data:result});
  }

})


};



exports.editdna = (req, res, next) => {
  var id = req.params.id;
  var dna_name = req.body.dna_name;
console.log('edit dna');
dna.updatedna({
  id: id,
  field_name:dna_name
}, function (err, result) {
  if (err) {
   console.log(err);
  }

 req.flash('success','<strong>Success! </strong>DNA Updated Sucessfully')
  res.redirect('/dna');
})


};




/*exports.deletedna = (req, res, next) => {
  var id = req.params.id;

  dna.deletedna({
    id: id
  }, function (err, result) {
    if (err) {
      throw new err;
    }
    res.redirect('/module');
  })
};*/




