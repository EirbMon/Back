exports.GetByType = function(req, res, Eirbdex, name){
    console.log("Request GET by type, collection: " + name);
    Eirbdex.findOne({ type: req.params.type })
    .then(data => {
        res.json(data);
    }).catch(err => {
        res.status(500).send({
            msg: err.message
        });
    });
}

