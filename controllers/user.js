var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var db = require('../config.js');
let mysql = require('mysql');
var crypto = require('crypto');
var Userdata = require("../models/user");
var async = require('async');
var url = require('url');
var multer = require('multer');//image upload
var expressValidator = require('express-validator');

//image path for uploaded
var Storage = multer.diskStorage({
  destination: function(req, file, callback) {
      callback(null, "./public/images");
  },
  filename: function(req, file, callback) {
      callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  }
});
      //file filter
      const fileFilter=(req,file,cb)=>{
        if(file.mimetype==='image/jpeg' || file.mimetype==='image/png'){
    cb(null,true);
        }
        else{
          let er = [{msg:'Only images are allowed'}];
          return cb(er, null)  
        }
    };

var upload = multer({
  storage: Storage,fileFilter:fileFilter
}).single("imgUploader"); //Field name and max count

let connection = mysql.createConnection(mysql);
//Difine variable for Pagination
var totalEmployee = 0;
var pageSize = 15;
var pageCount = 0;
var start = 0;
var currentPage = 1;

/* Get list of users*/
exports.getallusers = (req, res, next) => {

  Userdata.usersCount(function (err, result) {
    if (err) throw err;
    totalEmployee = result[0].total;

    pageCount = Math.ceil(totalEmployee / pageSize);
    if (typeof req.query.page !== 'undefined') {
      currentPage = req.query.page;
    }

    if (parseInt(currentPage) > 1) {
      start = (currentPage - 1) * pageSize;
    }

    Userdata.getAllEmployee({
      offset: start,
      limit: pageSize
    }, function (err, result) {
      if (err) {
        res.json(err);
      } else {

        res.render('dashboard', {
          data: result,
          pageCount: pageCount,
          pageSize: pageSize,
          currentPage: currentPage
        });

      }

    });
  });

};

//deleting user data
exports.deleteusers = (req, res, next) => {
  var id = req.params.id;

  Userdata.deleteuserdata({
    id: id
  }, function (err, result) {
    if (err) {
      throw new err;
    }
    res.redirect('/dashboard');
  })
};


//redirect to register page
exports.register = (req, res, next) => {
  let errors = [];  
  res.render('register',{
    errors:errors,
    success:'',
  });

};

exports.setting = (req, res, next) => {

  let errors = [];  
  res.render('setting',{
    errors:errors,
    success:'',
  });

};

exports.settingupdate =   (req, res, next) => {

 


 upload(req, res, function(err) {
    if (err) {
      console.log(err)

     res.render('setting',{user:req.user,errors:err,success:''});
    // return res.end(err);
    }
    else{
    var userdata=req.user;
    var id=userdata.id;  

    console.log(req.file);
  /* if(req.file.filename==undefined){
     console.log('undefined test')
   }*/

  var filename=req.file.filename;//filename coming




//insert data
let data = updateavtar(id,filename);
data.then(() =>  console.log("B") )

      req.flash('success', 'Image Uploaded sucessfully');
      
      res.redirect('setting');
    }


});


};


exports.home = (req, res, next) => {

  Userdata.usersCount(function(err,result) { 


    
    if (err) {
      console.log(err);
    }
    else{

      var totaluser=result[0].total;
      var last7=result[0].last7;
      var last30=result[0].last30;
    
      Userdata.countdevice(function(err1,result1){
        
        if (err1) {
          console.log(err1);
        }
        else{
          req.flash('success', 'Registration successfully');
          res.locals.message = req.flash();
          res.render('home',{data: totaluser,last30:last30,last7:last7,device:result1});
        }
        
      });
     
    }   
  
   });


};

//Edit users
exports.editusers = (req, res, next) => {
  var id = req.params.id;
  Userdata.edituserdata({
    id: id
  }, function (err, result) {
    if (err) {
      throw new err;
    }

    res.render('edituser', {
      data: result
    });
  })
};

//update users
exports.updateusers = (req, res, next) => {
  var id = req.params.id;
  var firstname = req.body.fname;
  var lastname = req.body.lname;

  Userdata.updateuserdata({
    id: id,
    firstname: firstname,
    lastname: lastname
  }, function (err, result) {
    if (err) {
      console.log(err)
    }

    res.redirect('/dashboard');
  })
};


exports.searchs = (req, res, next) => {

  var totalEmployee = 0;
  var pageSize = 150;
  var pageCount = 0;
  var start = 0;
  var currentPage = 1;

  var search = req.body.search;

  db.query('SELECT * from user_login where firstname like "%' + search + '%"', function (err, rows, fields) {
    if (err) throw err;
    console.log(rows);

    res.render('dashboard', {
      data: rows,
      pageCount: pageCount,
      pageSize: pageSize,
      currentPage: currentPage
    });
  });
};

exports.customsearch = (req, res, next) => {

  var url = req.url;
console.log(req.protocol);

};

exports.reset1 = (req, res, next) => {

  var email = req.body.email;
  Userdata.emailexists({
    email:email
  },function(err,result){
    if (err) {
      console.log(err)
    }
    else{
      var count=result.length;


      if(count>=1){
var host=req.headers.host;

crypto.randomBytes(20, function(err, buf) {
  var token = buf.toString('hex');
  sendmail(email,'rdrd',host,token)   
        req.flash('success', 'An e-mail has been sent to ' + email + ' with further instructions.');
        res.redirect('/');

});

      
      }
      else{
 
        console.log(token);
        req.flash('danger', 'Email Do not exists');
     // res.redirect('/');
      }
    }
  })



};


exports.reset = (req, res, next) => {

  var email = req.body.email;
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {


      Userdata.emailexists({
        email:email
      },function(err,result){

        var count=result.length;

        if(count==0){
          
          req.flash('danger', 'Email Do not exists');
          return res.redirect('/');
        }
        
Userdata.updatetoken({
  email:email,
  token:token
},function(err,result){
  done(err, token, result);
})

      });
    },
    function(token, user, done) {

     // sendmail(email,'rdrd',req.headers.host,token);
     
     var smtpTransport = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
          user: 'sopcqgijoyrua7w2@ethereal.email', // generated ethereal user
          pass: 'TpVqQQvPw7hTZVbkWd' // generated ethereal password
      }
  });

    
    let mailOptions = {
      from: email, // sender address
      to: 'rajat42059@gmail.com', // list of receivers
      subject: 'Forgot Password', // Subject line 
     html: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
    'Please click on the following link to complete the process:\n\n' +
    '<p>Click <a href="'+ 'http://' + req.headers.host + '/reset/' + token + '" target="_blank" >here</a> to reset your password</p>'
    
  };
    smtpTransport.sendMail(mailOptions, function(err) {
      req.flash('success', 'An e-mail has been sent to ' + email + ' with further instructions.');
      done(err, 'done');
    });
  }
  ], function(err) {
  
    if (err) return next(err);
    res.redirect('/');
  });
    

};


function  sendmail(email,password,host,token)  {  
                  nodemailer.createTestAccount((err, account) => {

                    if (err) {
                      console.error('Failed to create a testing account. ' + err.message);
               //       req.flash('danger', 'Failed to create a testing account. ' + err.message);
      //    return res.redirect('/');
                      return process.exit(1);
                  }
              
              console.log('Credentials obtained, sending message...');

                      // create reusable transporter object using the default SMTP transport
                      let transporter = nodemailer.createTransport({
                          host: 'smtp.ethereal.email',
                          port: 587,
                          secure: false, // true for 465, false for other ports
                          auth: {
                              user: 'ikcjwdpj4e3fzl6r@ethereal.email', // generated ethereal user
                              pass: '9fT2ZJEguRdm7s6JWs' // generated ethereal password
                          }
                      });
                    
                      // setup email data with unicode symbols
                      let mailOptions = {
                          from: email, // sender address
                          to: 'rajat42059@gmail.com', // list of receivers
                          subject: 'Forgot Password', // Subject line 
                         html: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                        '<p>Click <a href="'+ 'http://' + host + '/reset/' + token + '" target="_blank" >here</a> to reset your password</p>'
                        
                      };


                      
                      // send mail with defined transport object
                      transporter.sendMail(mailOptions, (err, info) => {
                          if (err) {
                              return err;
                          }
                       
                          console.log('Message sent: %s', info.messageId);
                          // Preview only available when sending through an Ethereal account
                          console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                    
                      });
                    });
                  };
                  exports.resetpasswordform = (req, res, next) => {
                    var q = url.parse(req.url, true);
         
                   var token=q.pathname.split("/")[2];


                    res.render('updatepassword',{success:'',token:token, errors:'',});
                  
                  };

                  exports.updatepassword = (req, res, next) => {
                    var password=req.body.password;       
                    var cpassword=req.body.cpassword;
                    var token=req.params.token;
              
                    req.checkBody('password', 'Password is required').notEmpty();
                    req.checkBody('cpassword', 'Passwords do not match').equals(req.body.password);
                    let errors = req.validationErrors();
                    if(errors){
                     
                      res.render('updatepassword', {
                        errors:errors,
                        success:'',
                        token:''
                      });
                    }
                    else{
                     
                      Userdata.updatepassword({                       
                        password:password,
                        token:token
                      }, function (err, result) {
                        if (err) {
                          console.log(err);
                        }
                        else{
                          req.flash('success','Password Updated Sucessfully');
                          res.redirect('/');
                        }
                      })  


                    }
                  
                  };

                  function updateavtar(id,filename) {

                    return new Promise(function(resolve, reject) {
                  
                      Userdata.updateavatar({//uplod imge
                          id: id,
                          filename:filename
                        },function (err, result) {
                          if(err) {
                            reject(err);
                          } 
                         
                          resolve(result);
                  
                        })
                        
                    })
                  }

            