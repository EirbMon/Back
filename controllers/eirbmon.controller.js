const blockchainCtrl = require('../controllers/blockchain.controller');
var schedule = require('node-schedule');

exports.CreateEirbmon = function (req, res, Eirbmon, name) {
    eirbmon = new Eirbmon();
    console.log("Request POST: collection: " + name);
    eirbmon.type = req.body.type;
    eirbmon.name = req.body.name;

    if (!req.body.owner_id)
        eirbmon.owner_id = "0x0000000000000000000000000000000000000000";
    else
        eirbmon.owner_id = req.body.owner_id;

    eirbmon.idInBlockchain = req.body.id;
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


exports.UpdateEirbmonTable = function (Eirbmon) {
    console.log('update Eirbmon database')
    Eirbmon.deleteMany({}, function (err) { })
    let _EirbmonsArray = [];
    blockchainCtrl.getAllEirbmons(function (_EirbmonsFromBlockchain) {
        _EirbmonsFromBlockchain = blockchainCtrl.parseEirbmon(_EirbmonsFromBlockchain);
        for (let index = 0; index < _EirbmonsFromBlockchain.length; index++) {
            let req = {
                body: {
                    idInBlockchain: _EirbmonsFromBlockchain[index].id,
                    type: _EirbmonsFromBlockchain[index].name,
                    name: _EirbmonsFromBlockchain[index].name,
                    owner_id: _EirbmonsFromBlockchain[index].owner,
                    skills_id: [0],
                    hp: _EirbmonsFromBlockchain[index].hp,
                    field: _EirbmonsFromBlockchain[index].field,
                    force: 0,
                    xp: 0,
                    lvl: _EirbmonsFromBlockchain[index].level,
                }
            }
            _EirbmonsArray.push(req.body);
        }
        console.log(_EirbmonsArray)
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

exports.getEirbmonById = function (req, res,Eirbmon) {
    console.log('set the Eirbmon Owner')
    blockchainCtrl.getEirbmonById(1,function (_Eirbmon) {
        res.json(_Eirbmon)
    })
}


exports.updateMongoEirbmonOwner = function(req, res,Eirbmon){
    console.log('update the Eirbmon Owner')
    var waitBlock = schedule.scheduleJob('0,10,20,30,40,50 * * * * *', function(){
        blockchainCtrl.getEirbmonById(req.body.idEirbmonBlockchain,function (_Eirbmon) {
            const _parseEirbmon = blockchainCtrl.parseEirbmon(_Eirbmon);
            console.log(_parseEirbmon[0].owner)
            if(_parseEirbmon[0].owner != "0x0000000000000000000000000000000000000000"){
                waitBlock.cancel();
                Eirbmon.updateOne({'idInBlockchain':req.body.idEirbmonBlockchain}, {'owner_id':_parseEirbmon[0].owner}, function(err, res) {
                    if (err) throw err;
                    console.log("owner updated");
                  });
            }
       })
    });

    res.json({'response':'the owner is being updated'})
        


// blockchainCtrl.parseEirbmon(_Eirbmon)
            // if (blockchainCtrl.parseEirbmon(_Eirbmon)){
            //     break;
            // }
        // Eirbmon.find({'idInBlockchain' : req.body.idEirbmonBlockchain})
        // .then(_Eirbmons => {
        //     res.json(_Eirbmons);
        // })
}