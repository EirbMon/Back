exports.CreateEirbmon = function(req, res, Eirbmon, name){
    eirbmon = new Eirbmon();
    console.log("Request POST: collection: "+ name);
    eirbmon.type = req.body.type;
    eirbmon.name = req.body.name;
    eirbmon.owner_id = req.body.owner_id;
    eirbmon.skills_id = req.body.skills_id;
    eirbmon.hp = req.body.hp;
    eirbmon.field = req.body.field;
    eirbmon.force = req.body.force;
    eirbmon.xp = req.body.xp;
    eirbmon.lvl = req.body.lvl;
    eirbmon.created_date = Date.now(); // Directly set "time" as the current date.
    eirbmon.updated_date = Date.now(); // Directly set "time" as the current date.
    eirbmon.save()
    res.json({eirbmon})
}

exports.GetOwnerEirbmons = function(req, res, Eirbmon, name){
    console.log("Request GetOwnerEirbmons, collection: " + name);
    Eirbmon.find({'owner_id': req.params.owner_id})
    .then(users => {
        res.json(users);
    }).catch(err => {
        res.status(500).send({
            msg: err.message
        });
    });
}