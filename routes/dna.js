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
  res.render('index',{errors:'',success:''});
});



router.post('/add',dnamodule.addmodule);


//router.delete('/delete/:id',dnamodule.deletednadata);

router.delete('/delete/:id',ensureAuthenticated,dnamodule.ajaxdeletedna);

router.get('/addnew/',ensureAuthenticated,dnamodule.filldropdown);//fills dropdown and display pagw

router.post('/addnew/',ensureAuthenticated,dnamodule.adddna);



router.get('/delete/:id',ensureAuthenticated,dnamodule.deletemodule);


/* Module Control*/
router.get('/edit/:id',ensureAuthenticated,dnamodule.editmodule);//editmodule form open
router.post('/update/:id',ensureAuthenticated,dnamodule.updatednamodule);//edit module done
/* Module ends here */

/* DNA Control*/
router.get('/editdna/:id',ensureAuthenticated,dnamodule.showediteddna);//edit dna open form
router.post('/dnaupdate/:id',ensureAuthenticated,dnamodule.editdna);//edit dna opeb form
/* DNA ends here */

router.get('/view/:id',ensureAuthenticated,dnamodule.viewdnamodule);



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