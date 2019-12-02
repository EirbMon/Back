const truffle_connect = require('../connection/app.js');
const UserCtrl = require('../controllers/user.controller.js');


exports.getAccounts = function(req, res){
      console.log("**** GET /getAccounts ****");
      truffle_connect.start(function (answer) {
      res.send(answer);
      })
}

exports.getMyEirbmon = function(req, res){
      truffle_connect.getMyEirbmon(req.body.account,function (answer) {
      res.send(answer);
     })
}

exports.getEirbmonWithoutOwner = function(req, res){
      truffle_connect.getEirbmonWithoutOwner(function (answer) {
      res.send(answer);
     })
}

exports.getAllEirbmons = function(req, res, User, name){
  a = UserCtrl.VerifyRights(req.body._id, req.body.token, User, name);
  a.then(val => 
  {
    if (val) {
      truffle_connect.getAllEirbmons(function (answer) {
        res.send(answer);
      })
    } else {
      console.log("ERROR NO RIGHTS");
      res.status(500).json({
        msg: "ERROR NO RIGHTS"
      })
    }
  })
  .catch(err => {console.log(err.message)});
}

exports.getAllEirbmons = function(callback){
  // if (UserCtrl.VerifyRights(req.body._id, req.body.token)) {
    truffle_connect.getAllEirbmons(callback)
  // }
}

exports.getEirbmonById = function(idEirbmon,callback){
  // if (UserCtrl.VerifyRights(req.body._id, req.body.token)) {
    truffle_connect.getEirbmonById(idEirbmon,callback)
  // }
}

exports.parseEirbmon = function(Eirbmons){
  // if (UserCtrl.VerifyRights(req.body._id, req.body.token)) {
    return truffle_connect.parseEirbmon(Eirbmons)
  // }
}

