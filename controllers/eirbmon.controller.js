exports.CreateEirbmon = function (req, res, Eirbmon, name) {
    eirbmon = new Eirbmon();
    console.log("Request POST: collection: " + name);
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
    res.json({ eirbmon })
}

exports.GetAllEirbmonsByOwner = function (req, res, Eirbmon, name) {
    console.log("Request GetAllByOwnerEirbmons, collection: " + name);
    Eirbmon.find({ 'owner_id': req.params.owner_id })
        .then(eirbmons => {
            res.json(eirbmons);
        }).catch(err => {
            res.status(500).send({
                msg: err.message
            });
        });
}
exports.GetAnyEirbmonsByOwner = function (req, res, Eirbmon, name) {
    console.log("Request GetAnyEirbmonsByOwner, collection: " + name);
    Eirbmon.find({ 'owner_id': req.params.owner_id })
        .then(eirbmons => {
            eirbmonsRetour = eirbmons.slice(0, req.body.number)
            console.log(eirbmonsRetour.length)
            res.json(eirbmonsRetour);
        }).catch(err => {
            res.status(500).send({
                msg: err.message
            });
        });
}


exports.UpdateEirbmonTable = function (Eirbmon, blockchainCtrl) {
    console.log('update Eirbmon database')
    Eirbmon.deleteMany({}, function (err) { })
    let _EirbmonsArray = [];
    blockchainCtrl.getAllEirbmons(function (_EirbmonsFromBlockchain) {
        for (let index = 0; index < _EirbmonsFromBlockchain.length; index++) {
            let req = {
                body: {
                    idInBlockchain: _EirbmonsFromBlockchain[index][0].toNumber(),
                    type: _EirbmonsFromBlockchain[index][1],
                    name: _EirbmonsFromBlockchain[index][1],
                    owner_id: _EirbmonsFromBlockchain[index][2],
                    skills_id: [0],
                    hp: _EirbmonsFromBlockchain[index][6].toNumber(),
                    field: _EirbmonsFromBlockchain[index][4],
                    force: 0,
                    xp: 0,
                    lvl: _EirbmonsFromBlockchain[index][3].toNumber(),
                }
            }
            _EirbmonsArray.push(req.body);
        }
        Eirbmon.insertMany(_EirbmonsArray, function (error, docs) { });
    })
}


exports.GetAllEirbmons = function (req, res, Eirbmon, name) {
    console.log("Request GetAllEirbmons, collection: " + name);
    Eirbmon.find()
    .then(_Eirbmons => {
        res.json(_Eirbmons);
    }).catch(err => {
        res.status(500).send({
            msg: err.message
        });
    });
}

