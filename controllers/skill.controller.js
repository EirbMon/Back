exports.CreateSkill = function(req, res, Skill, name){
    Skill.findOne({ 'name': req.body.name })
    .then(skill => {
        if (skill != null) {
            res.json({ "exist_skill": "true" });
        } 
        else {
            skill = new Skill();
            skill.id = req.body.id;
            skill.name = req.body.name;
            skill.pp = req.body.pp;
            skill.atk = req.body.atk;
            skill.field = req.body.field;
            skill.save();
            res.json({skill})
        }
    })
    .catch(err => {
        res.json({ "err": err.message });
    });
}


