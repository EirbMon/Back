
const nodemailer = require("nodemailer");

exports.SendEmail = function(req, User){

    const user = new User(req.body);
    console.log("Request POST ENVOIE EMAIL à: " +  req.body);

    nodemailer.createTestAccount((err, account) => {
        let transporter = nodemailer.createTransport({
        host: 'smtp.googlemail.com', // Gmail Host
        port: 465, // Port
        secure: true, // this is true as port is 465
        auth: {
            user: "winenote33@gmail.com",
            pass: "Winenote1$"
        }
        });
             
        let mailOptions = {
            from: "winenote33@gmail.com",
            to:  req.body.email,
            subject: "[WineNote] - Password forgot",
            html: `<p style="color:black;"> Bonjour, <br /><br /> Vous avez fait une demande de mot de passe oublié.
                Si vous n'etes pas l'auteur de cette demande, ignorez ce message. <br /> 
                Sinon, vous pouvez récupérer le code d'activation pour changer de mot de passe: <br /> <br />
                `+ req.body.name + ` <br /> <br /> Cordialement, <br /> L'équipe EnseirbMon. </p> `
        };
             
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
        });
    });

    res.json([]);
    next();
}
