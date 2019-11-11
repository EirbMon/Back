
const nodemailer = require("nodemailer");
 

exports.CreateEirbmon = function(req, res, Eirbmon, name){
    eirbmon = new Eirbmon();
    eirbmon.time = Date.now(); // Directly set "time" as the current date.
    console.log("Request POST: collection: "+ name);
    eirbmon.name = req.body.name;
    eirbmon.userOwnerId = req.body.userOwnerId;
    eirbmon.filiereId = req.body.filiereId;
    eirbmon.pv = req.body.pv;
    eirbmon.attaque = req.body.attaque;
    eirbmon.xp = req.body.xp;
    eirbmon.lvl = req.body.lvl;
    eirbmon.save()
    res.json({eirbmon})
}

