const blockchainCtrl = require('../controllers/blockchain.controller')
var schedule = require('node-schedule')

const CreateEirbmon = function (req, res, Eirbmon, name) {
  var eirbmon = new Eirbmon()
  console.log('Request POST: collection: ' + name)
  eirbmon.type = req.body.type
  eirbmon.name = req.body.name

  if (!req.body.owner_id) { eirbmon.owner_id = '0x0000000000000000000000000000000000000000' } else { eirbmon.owner_id = req.body.owner_id.toLowerCase() }

  eirbmon.idInBlockchain = req.body.id
  eirbmon.idInBlockchain = req.body.idInBlockchain
  eirbmon.skills_id = req.body.skills_id
  eirbmon.hp = req.body.hp
  eirbmon.field = req.body.field
  eirbmon.force = req.body.force
  eirbmon.xp = req.body.xp
  eirbmon.lvl = req.body.lvl
  eirbmon.created_date = Date.now() // Directly set "time" as the current date.
  eirbmon.updated_date = Date.now() // Directly set "time" as the current date.
  eirbmon.available = true
  eirbmon.save()
  res.json({ eirbmon })
}

const GetAllEirbmonsByOwner = function (req, res, Eirbmon, name) {
  console.log(req.params.owner_id)
  console.log('Request GetAllByOwnerEirbmons, collection: ' + name)
  Eirbmon.find({ owner_id: req.params.owner_id.toLowerCase() })
    .then(eirbmons => {
      res.json(eirbmons)
    }).catch(err => {
      res.status(500).send({
        msg: err.message
      })
    })
}
// rend indisponible les eirbmon envoyés
const setNotAvailable = function(_eirbmons,Eirbmon,owner_id){
  if(owner_id === "0x0000000000000000000000000000000000000000"){
    _eirbmons.forEach(element => {
      Eirbmon.updateOne({ idInBlockchain: element.idInBlockchain }, { available: false }, function (err, res) {
        if (err) throw err
      })
    });
  }
}


const GetAnyEirbmonsByOwner = function (req, res, Eirbmon, name) {
  console.log('Request GetAnyEirbmonsByOwner, collection: ' + name)

  if (req.params.number === undefined) { req.params.number = 0 }

  if (req.params.number <= 0) {
    this.GetAllEirbmonsByOwner(req, res, Eirbmon, name)
  } else {
    Eirbmon.find({ owner_id: req.params.owner_id.toLowerCase(),available:{$ne:false}})
    // Eirbmon.find({ owner_id: req.params.owner_id.toLowerCase()})
      .then(eirbmons => {
        var eirbmonsRetour = eirbmons.slice(0, req.params.number)
        setNotAvailable(eirbmonsRetour,Eirbmon,req.params.owner_id.toLowerCase())
        res.json(eirbmonsRetour)
      }).catch(err => {
        res.status(500).send({
          msg: err.message
        })
      })
  }
}

const GetEirbmonByidInBlockchain = function (req, res, Eirbmon, name) {
  console.log('Request GetEirbmonByidInBlockchains, collection: ' + name)
  Eirbmon.find({ idInBlockchain: req.params.idInBlockchain })
    .then(eirbmons => {
      res.json(eirbmons)
    }).catch(err => {
      res.status(500).send({
        msg: err.message
      })
    })
}

const Update = function (req, res, Collection, name) {
  console.log('Request PUT: collection: ' + name)
  console.log(req.body)
  if (req.body.owner_id !== undefined) {
    req.body.owner_id = req.body.owner_id.toLowerCase();
  }
  Collection.findOneAndUpdate({ idInBlockchain: req.body.idInBlockchain }, req.body, { new: true })
    .then(object => {
      if (!object) {
        return res.status(404).json({
          msg: name + ' not found with id ' + req.params._id + ', req: Update'
        })
      }
      res.json(object)
    })
    .catch(err => {
      console.log(err)
      return res.status(500).json({
        msg: err.message
      })
    })
}

const resetEirbmonTable = function (res, Eirbmon) {
    Eirbmon.deleteMany({}).then(()=>{
      UpdateEirbmonTable(res, Eirbmon)
    })
}

const UpdateEirbmonTable = function (res, Eirbmon) {
  console.log('update Eirbmon database')
  var promiseTab = [];
  blockchainCtrl.getAllEirbmons(function (_EirbmonsFromBlockchain) {
    _EirbmonsFromBlockchain = blockchainCtrl.parseEirbmon(_EirbmonsFromBlockchain)
    for (let index = 0; index < _EirbmonsFromBlockchain.length; index++) {
      _EirbmonToSave = {
        idInBlockchain: _EirbmonsFromBlockchain[index].id,
        type: _EirbmonsFromBlockchain[index].name,
        name: _EirbmonsFromBlockchain[index].name,
        owner_id: _EirbmonsFromBlockchain[index].owner.toLowerCase(),
        hp: _EirbmonsFromBlockchain[index].hp,
        field: _EirbmonsFromBlockchain[index].field,
        lvl: _EirbmonsFromBlockchain[index].level,
      }
      promiseTab.push(Eirbmon.updateOne({ idInBlockchain: _EirbmonToSave.idInBlockchain }, _EirbmonToSave, { 'upsert': true }, function (err, res) {
        if (err) throw err
        })
      )
    }
    Promise.all(promiseTab).then(()=>GetAllEirbmons('req', res, Eirbmon, 'name') ,(err)=>res.status(500).send({msg: err.message}));
  })
}


const GetAllEirbmons = function (req, res, Eirbmon, name) {
  console.log('Request GetAllEirbmons, collection: ' + name)
  Eirbmon.find()
    .then(_Eirbmons => {
      res.json(_Eirbmons)
    }).catch(err => {
      res.status(500).send({
        msg: err.message
      })
    })
}

const getEirbmonById = function (req, res, Eirbmon) {
  console.log('set the Eirbmon Owner')
  blockchainCtrl.getEirbmonById(1, function (_Eirbmon) {
    res.json(_Eirbmon)
  })
}

const updateMongoEirbmonOwnerAccordingToBlockchain = function (idEirbmonBlockchain, Eirbmon, previousOwner,newOwner) {
  console.log('update the Eirbmon Owner')
  return new Promise(function (resolve, reject) {
    var waitBlock = schedule.scheduleJob('* * * * * *', function () {
      blockchainCtrl.getEirbmonById(idEirbmonBlockchain, function (_Eirbmon) {
        const _parseEirbmon = blockchainCtrl.parseEirbmon(_Eirbmon)
        // console.log('update :'+_parseEirbmon[0].owner)
        if (_parseEirbmon[0].owner !== previousOwner.toLowerCase() && _parseEirbmon[0].owner === newOwner.toLowerCase()) {
          waitBlock.cancel()
          Eirbmon.updateOne({ idInBlockchain: idEirbmonBlockchain }, { owner_id: _parseEirbmon[0].owner.toLowerCase() }, function (err, res) {
            if (err) throw err
            Eirbmon.find({idInBlockchain: idEirbmonBlockchain}).then (data =>{
              resolve(data)
            })      
          })
        }
      })
    })
  })
}

// attend qu'un nouvel Eirmon soit créé pour l'ajouter à mongo
const waitNewEirbmon = function (Eirbmon) {
  console.log('wait the creation of an new Eirbmon')
  return new Promise(function (resolve, reject) {
    Eirbmon.count().then((count) => {
      var waitBlock = schedule.scheduleJob('* * * * * *', function () {
        blockchainCtrl.getEirbmonById(count + 1, (_Eirbmon) => {
          console.log(_Eirbmon[0][3])
          const _parseEirbmon = blockchainCtrl.parseEirbmon(_Eirbmon)
          if (_parseEirbmon[0].id !== 0) {
            const eirbmonToSave = {
              idInBlockchain: _parseEirbmon[0].id,
              type: _parseEirbmon[0].name,
              name: _parseEirbmon[0].name,
              owner_id: _parseEirbmon[0].owner.toLowerCase(),
              skills_id: [0],
              hp: _parseEirbmon[0].hp,
              field: _parseEirbmon[0].field,
              force: 0,
              xp: 0,
              lvl: _parseEirbmon[0].level            }
            Eirbmon.create(eirbmonToSave, function (err, res) {
              if (err) throw err
              waitBlock.cancel()
              resolve(eirbmonToSave.owner_id)
            })
          }
        })
      })
    })
  })
}

const catchEirbmon = function (req, res, Eirbmon) {
  req.params.owner_id = req.body.owner_id
  var catchedEirbmon;
  var tabProm = [
    updateMongoEirbmonOwnerAccordingToBlockchain(req.body.id_eirbmon_blockchain, Eirbmon, '0x0000000000000000000000000000000000000000',req.params.owner_id).then(data => {console.log(data); return catchedEirbmon = data}),
    waitNewEirbmon(Eirbmon).then(data => console.log(data))
  ]
  Promise.all(tabProm).then(() => { res.json(catchedEirbmon) }, () => console.log('error'))
}

const updateOwner = function (req, res, Eirbmon) {
  return updateMongoEirbmonOwnerAccordingToBlockchain(req.body.id_eirbmon_blockchain, Eirbmon, '0x0000000000000000000000000000000000000000',req.body.owner_id).then((_Eirbmon) => {
    res.json(_Eirbmon)
  }, () => console.log('error'))
}

const exchangeEirbmon = function (req, res, Eirbmon) {
  var tabProm = [
    updateMongoEirbmonOwnerAccordingToBlockchain(req.body.id_eirbmon_blockchain_1, Eirbmon, req.body.owner_id_1,req.body.owner_id_2),
    updateMongoEirbmonOwnerAccordingToBlockchain(req.body.id_eirbmon_blockchain_2, Eirbmon, req.body.owner_id_2,req.body.owner_id_1)
  ]
  Promise.all(tabProm).then(() => { res.json({ 'response': 'mongo is up to date' }), () => console.log('error') })
}

const addFirstEirbmon = function (req, res, Eirbmon) {
  req.params.owner_id = req.body.owner_id
  waitNewEirbmon(Eirbmon).then(() => GetAllEirbmonsByOwner(req, res, Eirbmon, 'Eirbmon'))
}

module.exports = {
  addFirstEirbmon: addFirstEirbmon,
  CreateEirbmon: CreateEirbmon,
  GetAnyEirbmonsByOwner: GetAnyEirbmonsByOwner,
  GetAllEirbmonsByOwner: GetAllEirbmonsByOwner,
  GetEirbmonByidInBlockchain: GetEirbmonByidInBlockchain,
  Update: Update,
  GetAllEirbmons: GetAllEirbmons,
  UpdateEirbmonTable: UpdateEirbmonTable,
  getEirbmonById: getEirbmonById,
  catchEirbmon: catchEirbmon,
  updateOwner: updateOwner,
  exchangeEirbmon: exchangeEirbmon,
  resetEirbmonTable: resetEirbmonTable
}
