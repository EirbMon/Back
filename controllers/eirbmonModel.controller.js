
const nodemailer = require("nodemailer");

exports.CreateEirbmonModel = function(req, res, EirbmonModel, name){
    EirbmonModel.findOne({ 'name': req.body.name })
    .then(eirbmonModel => {
        if (eirbmonModel != null) {
            res.json({ "exist_eirbmonModel": "true" });
        } 
        else {
            eirbmonModel = new EirbmonModel();
            eirbmonModel.name = req.body.name;
            eirbmonModel.pathImage = req.body.pathImage;
            eirbmonModel.save();
            res.json({eirbmonModel})
        }
    })
    .catch(err => {
        res.json({ "err": err.message });
    });
}


exports.GetByNameEirbmonModel = function (req, res, EirbmonModel, name){
    console.log("Request GET by email, collection: " + name);
    EirbmonModel.findOne({ 'name': req.params.name })
    .then(eirbmonModel => {
        res.json(eirbmonModel);
    }).catch(err => {
        res.status(500).send({
            msg: err.message
        }); 
    });
}

exports.GetByPathImageEirbmonModel = function (req, res, EirbmonModel, name){
    console.log("Request GET by email, collection: " + name);
    EirbmonModel.findOne({ 'pathImage': req.params.pathImage })
    .then(eirbmonModel => {
        res.json(eirbmonModel);
    }).catch(err => {
        res.status(500).send({
            msg: err.message
        }); 
    });
}