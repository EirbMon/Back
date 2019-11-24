const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
                const token = jwt.sign({ id: user.id, name: user.name }, 'my_key',{ expiresIn: 60*60*24});
                res.json({ token: token, name: user.name, email: user.email })
                console.log("Create new user" + user);
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


exports.Auth = function(req, res, User, name) {
    User.findOne({ 'email': req.body.email })
    .then(user => {
        console.log(user);
        if (user == null) {
            res.json({ "check_user": "false" });
        } else {
            result = bcrypt.compareSync(req.body.password, user.password);
            if(result)
            {
                // création du token qui expire au bout de 24h
                const token = jwt.sign({ id: user._id, email: user.email }, 'my_key',{ expiresIn: 60*60*24});
                res.json({ token: token, name: user.name, email: user.email })
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

exports.TestToken = function(req, res, User, name) {
    //app.get('/api/test', ensureToken, (req, res) => {
    jwt.verify(req.body.token, 'my_key', (err, data) => {
      if (err) {
        res.status(403).json(err);
      } else {
        res.json({
          text: 'this is protected',
          data: data
        });
      }
    });
// });
}

exports.VerifyRights = function(id, token) {
  return true;
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
