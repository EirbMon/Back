
const nodemailer = require("nodemailer");

exports.CreateFiliere = function(req, res, Filiere, name){
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


exports.GetAllFiliere = function(req, res, Filiere, name){
    console.log("Request GET All: collection: " + name);
    Filiere.find()
    .then(req => {
        res.json(req);
    }).catch(err => {
        res.status(500).send({
            msg: err.message
        });
    });
};

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

exports.UpdateFiliere = function(req, res, Filiere, name){
    console.log("Request PUT: collection: " + name);

        Filiere.findByIdAndUpdate(req.body._id, req.body, {new: true})
        .then(filiere => {
            if(!filiere) {
                return res.status(404).json({
                    msg: name + " not found with id " + req.params._id  + ", req: Update"
                });
            }
            res.json(filiere);
         })
         .catch(err => {
            return res.status(500).json({
                msg: err.message
            });
         });
}

exports.DeleteFiliere = function(req, res, Filiere, name){
    console.log("Request DELETE byID: collection: " + name);
    Filiere.findByIdAndRemove(req.params._id)
    .then(filiere => {
        if(!filiere) {
            return res.status(404).json({
                msg: name + " not found with id " + req.params._id + ", req: Delete"
            });
        }
        res.json({msg: "Filiere deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).json({
                msg: name + "not found with id " + req.params._id + ", req: Delete"
            });
        }
        return res.status(500).json({
            msg: "Could not delete filiere with id " + req.params._id + ", req: Delete"
        });
    });
}
