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
  eirbmon.save()
  res.json({ eirbmon })
}

const GetAllEirbmonsByOwner = function (req, res, Eirbmon, name) {
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

const GetAnyEirbmonsByOwner = function (req, res, Eirbmon, name) {
  console.log('Request GetAnyEirbmonsByOwner, collection: ' + name)

  if (req.params.number === undefined) { req.params.number = 0 }

  if (req.params.number <= 0) { this.GetAllEirbmonsByOwner(req, res, Eirbmon, name) } else {
    Eirbmon.find({ owner_id: req.params.owner_id.toLowerCase() })
      .then(eirbmons => {
        var eirbmonsRetour = eirbmons.slice(0, req.params.number)
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
    req.body.owner_id = req.body.owner_id.lower_case()
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

const UpdateEirbmonTable = function (res, Eirbmon) {
  console.log('update Eirbmon database')
  Eirbmon.deleteMany({}, function (err) { })
  const _EirbmonsArray = []
  blockchainCtrl.getAllEirbmons(function (_EirbmonsFromBlockchain) {
    _EirbmonsFromBlockchain = blockchainCtrl.parseEirbmon(_EirbmonsFromBlockchain)
    for (let index = 0; index < _EirbmonsFromBlockchain.length; index++) {
      const req = {
        body: {
          idInBlockchain: _EirbmonsFromBlockchain[index].id,
          type: _EirbmonsFromBlockchain[index].name,
          name: _EirbmonsFromBlockchain[index].name,
          owner_id: _EirbmonsFromBlockchain[index].owner.toLowerCase(),
          skills_id: [0],
          hp: _EirbmonsFromBlockchain[index].hp,
          field: _EirbmonsFromBlockchain[index].field,
          force: 0,
          xp: 0,
          lvl: _EirbmonsFromBlockchain[index].level
        }
      }
      _EirbmonsArray.push(req.body)
    }
    res.json({ update: 'ok', _EirbmonsArray })

    Eirbmon.insertMany(_EirbmonsArray, function (error, docs) { })
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

const updateMongoEirbmonOwnerAccordingToBlockchain = function (idEirbmonBlockchain, Eirbmon, previousOwner) {
  console.log('update the Eirbmon Owner')
  return new Promise(function (resolve, reject) {
    var waitBlock = schedule.scheduleJob('* * * * * *', function () {
      blockchainCtrl.getEirbmonById(idEirbmonBlockchain, function (_Eirbmon) {
        const _parseEirbmon = blockchainCtrl.parseEirbmon(_Eirbmon)
        if (_parseEirbmon[0].owner !== previousOwner.toLowerCase()) {
          waitBlock.cancel()
          Eirbmon.updateOne({ idInBlockchain: idEirbmonBlockchain }, { owner_id: _parseEirbmon[0].owner.toLowerCase() }, function (err, res) {
            if (err) throw err
            resolve(_parseEirbmon[0].owner)
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
              lvl: _parseEirbmon[0].level
            }
            Eirbmon.create(eirbmonToSave, function (err, res) {
              if (err) throw err
              resolve(eirbmonToSave.owner_id)
            })
            waitBlock.cancel()
          }
        })
      })
    })
  })
}

const catchEirbmon = function (req, res, Eirbmon) {
  var tabProm = [
    updateMongoEirbmonOwnerAccordingToBlockchain(req.body.idEirbmonBlockchain, Eirbmon, '0x0000000000000000000000000000000000000000').then(owner => { req.params.owner_id = owner }),
    waitNewEirbmon(Eirbmon).then(data => console.log(data))
  ]
  Promise.all(tabProm).then(() => { GetAllEirbmonsByOwner(req, res, Eirbmon, 'Eirbmon') }, () => console.log('error'))
}

const updateOwner = function (req, res, Eirbmon) {
  return updateMongoEirbmonOwnerAccordingToBlockchain(req.body.idEirbmonBlockchain, Eirbmon, '0x0000000000000000000000000000000000000000').then((owner) => {
    req.params.owner_id = owner
    GetAllEirbmonsByOwner(req, res, Eirbmon, 'Eirbmon')
  }, () => console.log('error'))
}

const exchangeEirbmon = function (req, res, Eirbmon) {
  var tabProm = [
    updateMongoEirbmonOwnerAccordingToBlockchain(req.body.idEirbmonBlockchain1, Eirbmon, req.body.ownerId1),
    updateMongoEirbmonOwnerAccordingToBlockchain(req.body.idEirbmonBlockchain2, Eirbmon, req.body.ownerId2)
  ]
  Promise.all(tabProm).then(() => { res.json({'response':'mongo is up to date'}), () => console.log('error') })
}

const addFirstEirbmon = function (req, res, Eirbmon) {
  req.params.owner_id = req.body.owner_id
  waitNewEirbmon(Eirbmon).then(GetAllEirbmonsByOwner(req, res, Eirbmon, 'Eirbmon'))
}

module.exports = {
  addFirstEirbmon:addFirstEirbmon,
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
  exchangeEirbmon: exchangeEirbmon
}
