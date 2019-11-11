const nodemailer = require("nodemailer");

exports.Create = function(req, res, Filiere, name){
    Filiere.findOne({ 'name': req.body.name })
    .then(filiere => {
        if (filiere != null) {
            res.json({ "exist_filiere": "true" });
        } 
        else {
            filiere = new Filiere();
            filiere.name = req.body.name;
            filiere.save();
            res.json({filiere})
        }
    })
    .catch(err => {
        res.json({ "err": err.message });
    });
}


exports.GetByIdFiliere = function (req, res, Filiere, name){
    console.log("Request GET by ID: collection: " + name);
    Filiere.findById(req.params._id)
    .then(filiere => {
        if(!filiere) {
            return res.status(404).json({
                msg: name + " not found with id " + req.params._id + ", req: GetById"
            });
        }
        res.json(filiere);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).json({
                msg: name + " not found with id " + req.params._id + ", req: GetById"
            });
        }
        return res.status(500).json({
            msg: "Error retrieving Filiere with id " + req.params._id + ", req: GetById"
        });
    });
}


exports.GetByNameFiliere = function (req, res, Filiere, name){
    console.log("Request GET by email, collection: " + name);
    Filiere.findOne({ 'name': req.params.name })
    .then(filiere => {
        res.json(filiere);
    }).catch(err => {
        res.status(500).send({
            msg: err.message
        }); 
    });
}