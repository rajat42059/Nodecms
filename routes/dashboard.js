var express = require('express');
var router = express.Router();
var db = require('../config.js');

const UserController = require('../controllers/user');



router.get('/',ensureAuthenticated,UserController.getallusers);//displaying dashboard

/*router.get('/home', function(req, res){
    res.redirect('home');
  });*/

router.get('/edit/:id',ensureAuthenticated,UserController.editusers);//loading edit form

router.get('/delete/:id',ensureAuthenticated,UserController.deleteusers);

router.post('/update/:id',ensureAuthenticated,UserController.updateusers);//update users


router.post('/go',ensureAuthenticated,UserController.searchs);

router.post('/customsearch',ensureAuthenticated,UserController.customsearch);



    // Access Control
    function ensureAuthenticated(req, res, next){
      if(req.isAuthenticated()){
        return next();
      } else {
       
        req.flash('danger', 'Please login');
        res.redirect('/');
      }
    }

module.exports = router;
   
