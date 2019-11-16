exports.CreateEirbmon = function(req, res, Eirbmon, name){
    eirbmon = new Eirbmon();
    console.log("Request POST: collection: "+ name);
    eirbmon.type = req.body.type;
    eirbmon.name = req.body.name;
    eirbmon.owner_id = req.body.owner_id;
    eirbmon.skills_id = req.body.skills_id;
    eirbmon.hp = req.body.hp;
    eirbmon.force = req.body.force;
    eirbmon.xp = req.body.xp;
    eirbmon.lvl = req.body.lvl;
    eirbmon.created_date = Date.now(); // Directly set "time" as the current date.
    eirbmon.updated_date = Date.now(); // Directly set "time" as the current date.
    eirbmon.save()
    res.json({eirbmon})
}

