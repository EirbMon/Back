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
        res.json({ token: token, user: user })
        console.log(res.json);
    }).catch(err => {
        res.status(500).json({
            msg: err.message
        });
    });
    /*
    var new_password = bcrypt.hash(req.body.password, 10);
    new_password.then(function(value){
        user.password = value;
        user.email = req.body.email;
        user.username = req.body.username;
        user.cle = req.body.cle;
        user.addrBlockchain = req.body.addrBlockchain;
        //console.log(user.password);
        user.save()
        .then(data => {
            res.json(data);
        }).catch(err => {
            res.status(500).json({
                msg: err.message
            });
        });
    });*/
}

exports.Update = function(req, res, User, name){
    console.log("Request PUT: collection: " + name);

    var new_p = bcrypt.hash(req.body.password, 10);

    new_p.then(function(value){
        req.body.password = value;
        User.findByIdAndUpdate(req.body._id, req.body, {new: true})
        .then(user => {
            if(!user) {
                return res.status(404).json({
                    msg: name + " not found with id " + req.params._id  + ", req: Update"
                });
            }
            res.json(user);
        }).catch(err => {
            if(err.kind === 'ObjectId') {
                return res.status(404).json({
                    msg: name + " not found with id " + req.params._id + ", req: Update"
                });
            }
            return res.status(500).json({
                msg: "Error updating user with id " + req.params._id
            });
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
        if (user.length === 0) {
            res.json({ "check_user": "false" });
        } else {
            console.log(user);
            if(req.body.password === user.password)
            {
                // création du token qui expire au bout de 24h
                const token = jwt.sign({ id: user._id, username: user.username }, 'my_key',{ expiresIn: 60*60*24});
                res.json({ token: token })
            }
            else {
                res.json({ "check_password": "false" });
            }
            /*
            bcrypt.compare(user.password, items[0].password, function (err, result) {  // vérification du mot de passe
                if (result == true) {
                    // création du token qui expire au bout de 24h
                    const token = jwt.sign({ id: items[0]._id, username: items[0].username }, 'my_key',{ expiresIn: 60*60*24});
                    res.json({ token: token })

                } else {
                    res.json({ "check_password": "false" });
                }
            });
            */
        }
    });
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
