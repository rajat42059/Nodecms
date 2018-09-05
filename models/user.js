var db = require('../config.js');
var bcrypt = require('bcryptjs');


var users = {
  getAllEmployee : function(usersdata,callback) {
    db.query("select * from user_login Limit ?,?",[usersdata.offset,usersdata.limit],callback);
  },
  usersCount : function(callback) {
    db.query("SELECT (SELECT COUNT(*) FROM user_login ) as total, (SELECT COUNT(*) FROM user_login  WHERE last_login >= DATE(NOW()) - INTERVAL 7 DAY) as last7,(SELECT COUNT(*) FROM user_login  WHERE last_login >= DATE(NOW()) - INTERVAL 30 DAY) as last30", callback);
  

  },
  deleteuserdata : function(users,callback) {

    db.query("delete from user_login where id= ?",[users.id],callback);
  },

  edituserdata : function(users,callback) {

    db.query("select * from user_login where id= ?",[users.id],callback);
  },
  updateuserdata : function(users,callback) {

    db.query("update user_login set firstname=?,lastname=? where id= ?",[users.firstname,users.lastname,users.id],callback);
  },
  signup : function(users,callback) {

    bcrypt.hash(users.password, 10).then(function(hash) {//encrypting password
    return  db.query("insert into  user_login(firstname,lastname,email,last_login,password) values(?,?,?,?,?)",[users.firstname,users.lastname,users.email,'2018-08-28 00:00:00',hash],callback);
    
  }); 

  },

  viewdna : function(callback) {

    db.query("select d.id,d.field_name,m.module_name,m.module_color from dna_name d INNER join module m on d.module_id=m.module_id and d.module_id !=105 ",callback);
  },
  viewmodule : function(callback) {

    db.query("select * from module",callback);
  },
  addmodule : function(users,callback) {

    db.query("insert into  module(module_name,module_color,module_id) values(?,?,?)",[users.modulename,users.modulecolor,'10'],callback);
  },
  deletemodule : function(users,callback) {

    db.query("delete from module where id= ?",[users.id],callback);
  },

  deletemoduledna : function(users,callback) {
var id1=parseInt(users.id)+100;
    db.query("delete from dna_name where module_id= ?",[id1],callback);
  },
  viewdnamodule : function(users,callback) {

    db.query("select * from dna_name d INNER join module m on m.module_id=d.module_id where d.module_id= ?",[users.id],callback);
  },
//update dna
  editdnamodule : function(users,callback) {

    db.query("select * from module where id= ?",[users.id],callback);
  },

  updatednamodule : function(users,callback) {

    db.query("update module set module_name=?,module_color=? where id= ?",[users.module_name,users.module_color,users.id],callback);
  },
  countdevice:function(callback){
    db.query("SELECT (SELECT  count(DISTINCT(user_id)) FROM token  WHERE device_type =1) as android, (SELECT count(DISTINCT(user_id)) FROM token  WHERE device_type =2) as ios, (SELECT count(DISTINCT(user_id)) FROM token  WHERE device_type =3) as window",callback);
  },

  deletedna:function(users,callback){

    db.query("delete from  dna_name where id= ?",[users.id],callback);
  },
  adddna:function(users,callback){

    db.query("insert into  dna_name(field_name,module_id,user_id) values (?,?,?)",[users.dna_name,users.module_id,'0'],callback);
  },
  updatedna : function(users,callback) {

    db.query("update dna_name set field_name=? where id= ?",[users.field_name,users.id],callback);
  },
  dnaformpopulated : function(users,callback) {

    db.query("select d.id,d.field_name,m.module_name from dna_name d INNER join module m on m.module_id=d.module_id where d.id= ?",[users.id],callback);
  },
  //check email exists 
  emailexists : function(users,callback) {

    db.query("select * from user_login where email= ?",[users.email],callback);
  },

  updatetoken : function(users,callback) {

    db.query("update user_login set token=? where email= ?",[users.token,users.email],callback);
  },


  updatepassword : function(users,callback) {
    bcrypt.hash(users.password, 10).then(function(hash) {//encrypting password
      return  db.query("update user_login set password=? where token= ?",[hash,users.token],callback);
      
    });
//    db.query("update user_login set password=? where token= ?",[users.password,users.token],callback);
  },
}
 
module.exports = users;
//

