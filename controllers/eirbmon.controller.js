exports.CreateEirbmon = function(req, res, Eirbmon, name){
    eirbmon = new Eirbmon();
    console.log("Request POST: collection: "+ name);
    eirbmon.type = req.body.type;
    eirbmon.name = req.body.name;

    if (!req.body.owner_id)
        eirbmon.owner_id = "admin_id";
    else
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


exports.UpdateEirbmonTable = function(res,Eirbmon,EirbmonCtrl,blockchainCtrl,name){
    // Eirbmon.find()
    // .then(_Eirbmons => {
    //     _Eirbmons.forEach(_Eirbmon => {
    //         console.log(_Eirbmon.name)
    //     });
    // });
    blockchainCtrl.getAllEirbmons(function (_EirbmonsFromBlockchain) {
        for (let index = 0; index < _EirbmonsFromBlockchain.length; index++) {
            console.log(_EirbmonsFromBlockchain[index][0].toNumber())
            let req = {
                body:{
                    idInBlockchain : _EirbmonsFromBlockchain[index][0].toNumber(),
                    type : _EirbmonsFromBlockchain[index][1],
                    name : _EirbmonsFromBlockchain[index][1],
                    owner_id :  _EirbmonsFromBlockchain[index][2],
                    skills_id : [0],
                    hp : _EirbmonsFromBlockchain[index][6].toNumber(),
                    field : _EirbmonsFromBlockchain[index][4],
                    force : 0,
                    xp : 0,
                    lvl : _EirbmonsFromBlockchain[index][3].toNumber(),
                    }
                } 
                EirbmonCtrl.CreateEirbmon(req,res,Eirbmon,name);
        }
    })
}
