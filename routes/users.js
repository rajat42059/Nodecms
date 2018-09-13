var express = require('express');
var router = express.Router();
var db = require('../config.js');
var Employee = require("../models/user");
const UserController = require('../controllers/user');
const passport = require('passport');
const RegisterController = require('../controllers/register');
const dnamodule = require('../controllers/dnamodule');
/* GET users listing. */


//default login page
router.get('/', homepage,function(req, res) { 


            
  res.render('index',{errors:'',success:'' });
});

router.get('/home',ensureAuthenticated,UserController.home);


//reset password

router.post('/reset',UserController.reset);//to be continued

/* Password Activity*/
router.get('/reset/:id',UserController.resetpasswordform);//Update form open

router.post('/updatepassword/:token',UserController.updatepassword);//Update form 

/* Password Activity ends here*/

router.get('/register',UserController.register);

router.get('/dna',ensureAuthenticated,dnamodule.viewdna);

router.get('/module',ensureAuthenticated,dnamodule.viewmodule);


router.post('/login', function(req, res, next) {


  req.checkBody('email', 'Name is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();

  let errors = req.validationErrors();
  if(errors){
   console.log(errors);
    res.render('index', {
      errors:errors,
      success:''
    });
  } 

  passport.authenticate('local-login', function(err, user, info) {
    if (err) { return next(err); }
    // Redirect if it fails
    if (!user) { return res.redirect('/'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }

      // Redirect if it succeeds
      return res.redirect('home');

    });
  })(req, res, next);
});



// logout
router.get('/logout', function(req, res){
  req.logout();
  req.flash('inf', 'You are logged out ');
 // res.locals.message = req.flash();
 
  res.redirect('/');
});


// setting page open
router.get('/setting',ensureAuthenticated,UserController.setting);

//setting & image update

router.post('/setting',ensureAuthenticated,UserController.settingupdate);

//settings ends


router.post('/register',RegisterController.signup);

module.exports = router;

            // Access Control
            function ensureAuthenticated(req, res, next){
              if(req.isAuthenticated()){
                return next();
              } else {
             
                req.flash('danger', 'Please login');
                res.redirect('/');
              }
            }

            function homepage(req, res, next){
              if(req.isAuthenticated()){
                res.redirect('home');
              } 
              else{

                res.render('index',{errors:'',success:''});
              }
            }