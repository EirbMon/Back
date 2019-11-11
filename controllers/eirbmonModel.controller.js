
const nodemailer = require("nodemailer");

exports.CreateEirmonModel = function(req, res, EirmonModel, name){
    EirmonModel.findOne({ 'name': req.body.name })
    .then(eirmonModel => {
        if (eirmonModel != null) {
            res.json({ "exist_eirmonModel": "true" });
        } 
        else {
            eirmonModel = new EirmonModel();
            eirmonModel.name = req.body.name;
            eirmonModel.save();
            res.json({eirmonModel})
        }
    })
    .catch(err => {
        res.json({ "err": err.message });
    });
}


exports.GetAllEirmonModel = function(req, res, EirmonModel, name){
    console.log("Request GET All: collection: " + name);
    EirmonModel.find()
    .then(req => {
        res.json(req);
    }).catch(err => {
        res.status(500).send({
            msg: err.message
        });
    });
};

exports.GetByIdEirmonModel = function (req, res, EirmonModel, name){
    console.log("Request GET by ID: collection: " + name);
    EirmonModel.findById(req.params._id)
    .then(eirmonModel => {
        if(!eirmonModel) {
            return res.status(404).json({
                msg: name + " not found with id " + req.params._id + ", req: GetById"
            });
        }
        res.json(eirmonModel);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).json({
                msg: name + " not found with id " + req.params._id + ", req: GetById"
            });
        }
        return res.status(500).json({
            msg: "Error retrieving EirmonModel with id " + req.params._id + ", req: GetById"
        });
    });
}

const nodemailer = require("nodemailer");

exports.CreateEirmonModel = function(req, res, EirmonModel, name){
    EirmonModel.findOne({ 'name': req.body.name })
    .then(eirmonModel => {
        if (eirmonModel != null) {
            res.json({ "exist_eirmonModel": "true" });
        } 
        else {
            eirmonModel = new EirmonModel();
            eirmonModel.name = req.body.name;
            eirmonModel.save();
            res.json({eirmonModel})
        }
    })
    .catch(err => {
        res.json({ "err": err.message });
    });
}


exports.GetAllEirmonModel = function(req, res, EirmonModel, name){
    console.log("Request GET All: collection: " + name);
    EirmonModel.find()
    .then(req => {
        res.json(req);
    }).catch(err => {
        res.status(500).send({
            msg: err.message
        });
    });
};

exports.GetByIdEirmonModel = function (req, res, EirmonModel, name){
    console.log("Request GET by ID: collection: " + name);
    EirmonModel.findById(req.params._id)
    .then(eirmonModel => {
        if(!eirmonModel) {
            return res.status(404).json({
                msg: name + " not found with id " + req.params._id + ", req: GetById"
            });
        }
        res.json(eirmonModel);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).json({
                msg: name + " not found with id " + req.params._id + ", req: GetById"
            });
        }
        return res.status(500).json({
            msg: "Error retrieving EirmonModel with id " + req.params._id + ", req: GetById"
        });
    });
}


exports.GetByNameEirmonModel = function (req, res, EirmonModel, name){
    console.log("Request GET by email, collection: " + name);
    EirmonModel.findOne({ 'name': req.params.name })
    .then(eirmonModel => {
        res.json(eirmonModel);
    }).catch(err => {
        res.status(500).send({
            msg: err.message
        }); 
    });
}

exports.GetByPathImageEirmonModel = function (req, res, EirmonModel, name){
    console.log("Request GET by email, collection: " + name);
    EirmonModel.findOne({ 'name': req.params.name })
    .then(eirmonModel => {
        res.json(eirmonModel);
    }).catch(err => {
        res.status(500).send({
            msg: err.message
        }); 
    });
}

exports.UpdateEirmonModel = function(req, res, EirmonModel, name){
    console.log("Request PUT: collection: " + name);

        EirmonModel.findByIdAndUpdate(req.body._id, req.body, {new: true})
        .then(eirmonModel => {
            if(!eirmonModel) {
                return res.status(404).json({
                    msg: name + " not found with id " + req.params._id  + ", req: Update"
                });
            }
            res.json(eirmonModel);
         })
         .catch(err => {
            return res.status(500).json({
                msg: err.message
            });
         });
}

exports.DeleteEirmonModel = function(req, res, EirmonModel, name){
    console.log("Request DELETE byID: collection: " + name);
    EirmonModel.findByIdAndRemove(req.params._id)
    .then(eirmonModel => {
        if(!eirmonModel) {
            return res.status(404).json({
                msg: name + " not found with id " + req.params._id + ", req: Delete"
            });
        }
        res.json({msg: "EirmonModel deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).json({
                msg: name + "not found with id " + req.params._id + ", req: Delete"
            });
        }
        return res.status(500).json({
            msg: "Could not delete eirmonModel with id " + req.params._id + ", req: Delete"
        });
    });
}


exports.UpdateEirmonModel = function(req, res, EirmonModel, name){
    console.log("Request PUT: collection: " + name);

        EirmonModel.findByIdAndUpdate(req.body._id, req.body, {new: true})
        .then(eirmonModel => {
            if(!eirmonModel) {
                return res.status(404).json({
                    msg: name + " not found with id " + req.params._id  + ", req: Update"
                });
            }
            res.json(eirmonModel);
         })
         .catch(err => {
            return res.status(500).json({
                msg: err.message
            });
         });
}

exports.DeleteEirmonModel = function(req, res, EirmonModel, name){
    console.log("Request DELETE byID: collection: " + name);
    EirmonModel.findByIdAndRemove(req.params._id)
    .then(eirmonModel => {
        if(!eirmonModel) {
            return res.status(404).json({
                msg: name + " not found with id " + req.params._id + ", req: Delete"
            });
        }
        res.json({msg: "EirmonModel deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).json({
                msg: name + "not found with id " + req.params._id + ", req: Delete"
            });
        }
        return res.status(500).json({
            msg: "Could not delete eirmonModel with id " + req.params._id + ", req: Delete"
        });
    });
}
