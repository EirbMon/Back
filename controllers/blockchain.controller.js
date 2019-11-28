const truffle_connect = require('../connection/app.js');
const UserCtrl = require('../controllers/user.controller.js');


exports.getAccounts = function(req, res){
      console.log("**** GET /getAccounts ****");
      truffle_connect.start(function (answer) {
      res.send(answer);
      })
}

exports.getMyEirbmon = function(req, res){
    console.log("**** GET /getMyEirbmon ****");
    if (UserCtrl.VerifyRights(req.body._id, req.body.token)) {
      truffle_connect.getMyEirbmon(req.query.account,function (answer) {
      res.send(answer);
      })
    } else {
      console.log("ERROR NO RIGHTS");
      res.status(500).json({
        msg: "ERROR NO RIGHTS"
      })
    }
}

exports.getAllEirbmons = function(callback){
  // if (UserCtrl.VerifyRights(req.body._id, req.body.token)) {
    truffle_connect.getAllEirbmons(callback)
  // }
}
