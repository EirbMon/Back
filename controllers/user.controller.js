const nodemailer = require("nodemailer");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const GlobalCtrl = require('./global.controller.js');
const keyToken = "my_key";

exports.Create = function(req, res, User, name){

    User.findOne({ 'email': req.body.email })
    .then(user => {
        if (user != null) {
            res.json({ "exist_user": "true" });
        }
        else {
            user = new User();
            user.created_date = Date.now(); // Directly set "time" as the current date.
            console.log("Request POST: collection: "+ name);
            user.wallet_id = req.body.wallet_id;
            user.password = bcrypt.hashSync(req.body.password,10); // Hash Real Password
            user.email = req.body.email;
            user.name = req.body.name;
            user.permission = req.body.permission;
            user.save()
            .then(data => {
                // création du token qui expire au bout de 24h
                const token = jwt.sign({ id: user._id, email: user.email }, keyToken,{ expiresIn: 60*60*24});
                var monJson = {_id: user._id, token:token}
                User.findByIdAndUpdate(monJson._id, monJson, {new: false}).then(data => {
                    User.findOne({ 'email': req.body.email })
                    .then(user => {
                      res.json({ user })
                    }).catch(err => {
                        res.status(500).json({
                            msg: err.message
                        });
                    });
                    console.log("Create new user" + user);
                })
                .catch(err => {
                res.status(500).json({
                    msg: err.message
                });})

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

exports.GetByToken = function(req, res, User, name){
    console.log("Request GET by token, collection: " + name);
    User.findOne({ 'token': req.params.token })
    .then(users => {
        res.json(users);
    }).catch(err => {
        res.status(500).send({
            msg: err.message
        });
    });
}

exports.Update = function(req, res, Collection, name){
    console.log("Request PUT: collection: " + name);
    console.log(req.body);
        Collection.findOneAndUpdate({ "email" : req.body.email }, req.body, {new: true})
        .then(object => {
            if(!object) {
                return res.status(404).json({
                    msg: name + " not found with id " + req.params._id  + ", req: Update"
                });
            }
            res.json(object);
         })
         .catch(err => {
             console.log(err);
            return res.status(500).json({
                msg: err.message
            });
         });
}


exports.Auth = function(req, res, User, name) {
    User.findOne({ 'email': req.body.email })
    .then(user => {
        console.log(user);
        if (user == null) {
            res.json({ "check_user": "false" });
        } else {
            result = bcrypt.compareSync(req.body.password, user.password);
            console.log("works");
            if(result)
            {
                // création du token qui expire au bout de 24h
                const token = jwt.sign({ id: user._id, email: user.email }, keyToken,{ expiresIn: 60*60*24});
                var monJson = {_id: user._id, token: token}
                User.findByIdAndUpdate(monJson._id, monJson, {new: true}).then(data => {
                    //data.token = monJson.token;
                    res.json(data)
                    console.log("Create new user" + user);
                })
                .catch(err => {
                res.status(500).json({
                    msg: err.message
                });})
            }
            else {
                res.json({ "check_password": "false" });
            }
        }
    })
    .catch(err => {
        res.status(400).json({ "err": err.message});
    })
}

exports.VerifyRights = function(idUser, token, User, name) {
            jsonToken = { 'token': token };
            return Promise.resolve(
            jwt.verify(token, keyToken, (err, data) => {
                if (err) {
                    return Promise.resolve(false);
                }
                return Promise.resolve(User.findOne(jsonToken)
                .then(users => {
                    console.log(users._id, idUser)
                    if(users._id == idUser)
                    {
                        console.log("yeees");
                        return true;
                    }
                    else
                    {
                        console.log("nooo");
                        return false;
                    }
                })
                .catch());
              })
            .then(data =>{return data})
            .catch(err => {return err.message}));
}

exports.TestToken = function(req, res, User, name) {
    jwt.verify(req.body.token, keyToken, (err, data) => {
      if (err) {
        res.status(403).json(err);
      } else {
        res.json({
          text: 'this is protected',
          data: data
        });
      }
    });
}

exports.SendEmail = function(req, res){

    console.log("Request POST ENVOIE EMAIL à: " +  req.body);

    nodemailer.createTestAccount((err, account) => {
        let transporter = nodemailer.createTransport({
        host: 'smtp.googlemail.com', // Gmail Host
        port: 465, // Port
        secure: true, // this is true as port is 465
        auth: {
            user: "eirbmon@gmail.com",
            pass: "eirbmon2019"
        }
        });

        let mailOptions = {
            from: "eirbmon@gmail.com",
            to:  req.body.email,
            subject: "[Eirbmon] - Password forgot",
            html: `<p style="color:black;"> Bonjour, <br /><br /> Vous avez fait une demande de mot de passe oublié.
                Si vous n'êtes pas l'auteur de cette demande, ignorez ce message. <br />
                Sinon, vous pouvez récupérer le code d'activation pour changer de mot de passe: <br /> <br />
                `+ req.body.name + ` <br /> <br /> Cordialement, <br /> L'équipe Eirbmon. </p> `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            res.json(info.messageId);
        });
    });
}
