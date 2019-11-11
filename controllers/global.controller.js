exports.GetAll = function(req, res, Object, name){
    console.log("Request GET All: collection: " + name);
    Object.find()
    .then(req => {
        res.json(req);
    }).catch(err => {
        res.status(500).send({
            msg: err.message
        });
    });
};


exports.GetById = function (req, res, Object, name){
    console.log("Request GET by ID: collection: " + name);
    Object.findById(req.params._id)
    .then(object => {
        if(!object) {
            return res.status(404).json({
                msg: name + " not found with id " + req.params._id + ", req: GetById"
            });
        }
        res.json(object);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).json({
                msg: name + " not found with id " + req.params._id + ", req: GetById"
            });
        }
        return res.status(500).json({
            msg: "Error retrieving Object with id " + req.params._id + ", req: GetById"
        });
    });
}


exports.Update = function(req, res, Object, name){
    console.log("Request PUT: collection: " + name);

        Object.findByIdAndUpdate(req.body._id, req.body, {new: true})
        .then(object => {
            if(!object) {
                return res.status(404).json({
                    msg: name + " not found with id " + req.params._id  + ", req: Update"
                });
            }
            res.json(object);
         })
         .catch(err => {
            return res.status(500).json({
                msg: err.message
            });
         });
}

exports.Delete = function(req, res, Object, name){
    console.log("Request DELETE byID: collection: " + name);
    Object.findByIdAndRemove(req.params._id)
    .then(object => {
        if(!object) {
            return res.status(404).json({
                msg: name + " not found with id " + req.params._id + ", req: Delete"
            });
        }
        res.json({msg: "Object deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).json({
                msg: name + "not found with id " + req.params._id + ", req: Delete"
            });
        }
        return res.status(500).json({
            msg: "Could not delete object with id " + req.params._id + ", req: Delete"
        });
    });
}
