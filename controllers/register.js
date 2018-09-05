var express = require('express');
var router = express.Router();
const brcypt = require('bcryptjs')
var db = require('../config.js');
let mysql = require('mysql');
var Users = require("../models/user");
let connection = mysql.createConnection(mysql);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
 //redirect to register page

  // Local Strategy


  passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
},
function(req, email, password, done) { // callback with email and password from our form

  db.query('SELECT * FROM user_login WHERE email = ?',[email], function (error, results, fields) {
  
    var resultdata=results[0];
    if (error) {     
       console.log("error ocurred",error);
      
    }else{      
      if(results.length >0){ 
        brcypt.compare(password, results[0].password, function(err, ress) {
       if(!ress){
        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
          }else{ 
         Users.usersCount(function(err,result1) {
          var totaluser=result1[0].total;    
    
          return done(null, results[0]);   
         });  
            
          }
      });  
      }
      else{  
        return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
      }
    }
    });


}));



  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {

		done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
		db.query("select * from user_login where id = "+id,function(err,rows){	
    
			done(err, rows[0]);
		});
    });




          exports.signup=(req,res,next)=>{
            var fname=req.body.fname;
            var lname=req.body.lname;
            var email=req.body.email;
            var password=req.body.password;       
            var cpassword=req.body.cpassword;

            req.checkBody('fname', 'Name is required').notEmpty();
            req.checkBody('lname', 'Email is required').notEmpty();
            req.checkBody('email', 'Email is not valid').isEmail();        
            req.checkBody('password', 'Password is required').notEmpty();
            req.checkBody('cpassword', 'Passwords do not match').equals(req.body.password);
          
            let errors = req.validationErrors();
            if(errors){
             
              res.render('register', {
                errors:errors,
                success:''
              });
            } else  {

              Users.signup({
                firstname: fname,
                lastname:lname,
                email:email,
                password:password
              }, function (err, result) {
                if (err) {
                  console.log(err);
                }
                else{
                  req.flash('success','You are now registered and can log in');
                  res.redirect('/');
                }
              })            

            }
          }

