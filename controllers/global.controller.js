const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.GetAll = function(req, res, User, name){
    console.log("Request GET All: collection: " + name);
    User.find()
    .then(req => {
        res.json(req);
    }).catch(err => {
        res.status(500).send({
            msg: err.message
        });
    });
};

exports.GetById = function (req, res, User, name){
    console.log("Request GET by ID: collection: " + name);
    User.findById(req.params._id)
    .then(user => {
        if(!user) {
            return res.status(404).json({
                msg: name + " not found with id " + req.params._id + ", req: GetById"
            });
        }
        res.json(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).json({
                msg: name + " not found with id " + req.params._id + ", req: GetById"
            });
        }
        return res.status(500).json({
            msg: "Error retrieving User with id " + req.params._id + ", req: GetById"
        });
    });
}

exports.GetByEmail = function(req, res, User, name){
    console.log("Request GET by email, collection: " + name);
    User.findOne({ 'email': req.params.email })
    .then(users => {
        res.json(users);
    }).catch(err => {
        res.status(500).send({
            msg: err.message
        });
    });
}


exports.GetByCle = function(req, res, User, name){
    console.log("Request GET by name, collection: " + name);
    User.findOne({ 'cle': req.params.cle })
    .then(users => {
        res.json(users);
    }).catch(err => {
        res.status(500).send({
            msg: err.message
        });
    });
}

exports.GetByUsername = function(req, res, User, name){
    console.log("Request GET by name, collection: " + name);
    User.findOne({ 'name': req.params.name })
    .then(users => {
        res.json(users);
    }).catch(err => {
        res.status(500).send({
            msg: err.message
        });
    });
}


exports.Create = function(req, res, User, name){
    var userExiste = false;
    User.findOne({ 'username': req.body.username })
    .then(user => {
        if (user != null) {
            res.json({ "exist_user": "true" });
        } 
        else {
            user = new User();
            user.time = Date.now(); // Directly set "time" as the current date.
            console.log("Request POST: collection: "+ name);
            user.password = req.body.password;
            user.email = req.body.email;
            user.username = req.body.username;
            user.cle = req.body.cle;
            user.addrBlockchain = req.body.addrBlockchain;
            user.save()
            .then(data => {
                // création du token qui expire au bout de 24h
                const token = jwt.sign({ id: user.id, username: user.username }, 'my_key',{ expiresIn: 60*60*24});
                res.json({ token: token, name: user.username, email: user.email })
                console.log(res.json);
            }).catch(err => {
                res.status(500).json({
                    msg: err.message
                });
            });
        }
    })
    .catch(err => {
        res.json({ "err": err.message });
    });
}


exports.Update = function(req, res, User, name){
    console.log("Request PUT: collection: " + name);

        User.findByIdAndUpdate(req.body._id, req.body, {new: true})
        .then(user => {
            if(!user) {
                return res.status(404).json({
                    msg: name + " not found with id " + req.params._id  + ", req: Update"
                });
            }
            res.json(user);
         })
         .catch(err => {
            return res.status(500).json({
                msg: err.message
            });
         });
}

exports.Delete = function(req, res, User, name){
    console.log("Request DELETE byID: collection: " + name);
    User.findByIdAndRemove(req.params._id)
    .then(user => {
        if(!user) {
            return res.status(404).json({
                msg: name + " not found with id " + req.params._id + ", req: Delete"
            });
        }
        res.json({msg: "User deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).json({
                msg: name + "not found with id " + req.params._id + ", req: Delete"
            });
        }
        return res.status(500).json({
            msg: "Could not delete user with id " + req.params._id + ", req: Delete"
        });
    });
}


/*
exports.verifyToken = function(req,res,next) {
    if(!req.headers.authorization){
        return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1]
    if(token === 'null'){
        return res.status(401).send('Unauthorized request')
    }
    let payload = jwt.verify(token,'secretKey')
    if(!payload){
        return res.status(401).send('Unauthorized request')
    }
    req._id = payload.subject
    next()
};*/


exports.Auth = function(req, res, User, name) {
    User.findOne({ 'username': req.body.username })
    .then(user => {
        console.log(user);
        if (user == null) {
            res.json({ "check_user": "false" });
        } else {
            if(req.body.password === user.password)
            {
                // création du token qui expire au bout de 24h
                const token = jwt.sign({ id: user._id, username: user.username }, 'my_key',{ expiresIn: 60*60*24});
                res.json({ token: token, name: user.username, email: user.email })
            }
            else {
                res.json({ "check_password": "false" });
            }
        }
    })
    .catch(err => {
        res.json({ "err": err.message});
    })
}

exports.TestJeton = function(req, res, User, name) {
  app.get("/test", ensureToken, (req,res) => {
    jwt.verify(req.token, 'my_key', (err, data) => {
      if (err) {
        res.sendStatus(403);
      } else {
        res.json({
          text: 'this is protected',
          data: data
        });
      }
    });
  });
}
