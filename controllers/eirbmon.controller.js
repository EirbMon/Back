const blockchainCtrl = require('../controllers/blockchain.controller')
var schedule = require('node-schedule')
const moment  = require('moment');
var Skill = require('../schemas/skill.schema.js');
const SkillCtrl = require('../controllers/skill.controller.js');


const GetAllEirbmonsByOwner = function (req, res, Eirbmon, name) {
  console.log(req.params.owner_id)
  console.log('Request GetAllByOwnerEirbmons, collection: ' + name)
  Eirbmon.find({ owner_id: req.params.owner_id.toLowerCase() })
    .then(eirbmons => {
      console.log(eirbmons);
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
    if (req.params.owner_id == '0x0000000000000000000000000000000000000000'){
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
    else{
      Eirbmon.find({ owner_id: req.params.owner_id.toLowerCase()})
        .then(eirbmons => {
          res.json(eirbmons)
        }).catch(err => {
          res.status(500).send({
            msg: err.message
          })
        })
      }
    }
  }


const GetEirbmonByidInBlockchain = function (req, res, Eirbmon, name) {
  console.log('Request GetEirbmonByidInBlockchains, collection: ' + name)
  console.log(req.params.idInBlockchain);
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
  SkillCtrl.GetAllSkill(Skill).then((skill)=>{
  console.log(skill)
  console.log('update Eirbmon database')
  var promiseTab = [];
  blockchainCtrl.getAllEirbmons(function (_EirbmonsFromBlockchain) {
    blockchainCtrl.parseEirbmon(_EirbmonsFromBlockchain,(_parseEirbmon)=>{
      for (let index = 0; index < _parseEirbmon.length; index++) {
        _EirbmonToSave = {
          idInBlockchain: _parseEirbmon[index].id,
          type: _parseEirbmon[index].name,
          name: _parseEirbmon[index].name,
          owner_id: _parseEirbmon[index].owner.toLowerCase(),
          hp: _parseEirbmon[index].hp,
          canBeExhangedTo : _parseEirbmon[index].canBeExhangedTo,
          price : _parseEirbmon[index].price,
          canBeSelled : _parseEirbmon[index].canBeSelled,
          field: _parseEirbmon[index].field,
          evole: _parseEirbmon[index].evole,
          skills_id: [_parseEirbmon[index].atk[0],_parseEirbmon[index].atk[1],_parseEirbmon[index].atk[2]],
          skills : [skill.find(value => value.id == _parseEirbmon[index].atk[0]),skill.find(value => value.id == _parseEirbmon[index].atk[1]),skill.find(value => value.id == _parseEirbmon[index].atk[2])],
          value : _parseEirbmon[index].value,
          lvl: 0,
          created_date : moment.unix(_parseEirbmon[index].birthDate).toDate(),
        }
        console.log(_EirbmonToSave)
        promiseTab.push(Eirbmon.updateOne({ idInBlockchain: _EirbmonToSave.idInBlockchain }, _EirbmonToSave, { 'upsert': true }, function (err, res) {
          if (err) throw err
          })
        )
      }
      Promise.all(promiseTab).then(()=>GetAllEirbmons('req', res, Eirbmon, 'name') ,(err)=>res.status(500).send({msg: err.message}));
    }) 
  })
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

const findMyEvolution = function (req, res, Eirbmon, Eirbdex, name) {
  console.log('Request LevelUp, collection: ' + name);
  Eirbmon.findOne({ idInBlockchain: req.params.idInBlockchain })
  .then(eirbmon => { 
      Eirbdex.findOne({ type: eirbmon.type })
      .then(eirbdex => { 
        res.json({evolution: eirbdex.evolution, evolve: eirbmon.evolve, lvl: eirbmon.lvl});
      }) // fermeture then 2
      .catch(err => {res.status(500).send({msg: err.message})})
      }) // fermeture then 1
  .catch(err => {res.status(500).send({msg: err.message})})
}

const getEvolve = function (req, res, Eirbmon, Eirbdex, name) {
  console.log('Request LevelUp, collection: ' + name);
  Eirbmon.findOne({ idInBlockchain: req.params.idInBlockchain })
  .then(eirbmon => { 
      if (eirbmon.lvl < 100)return res.send({msg: 'The eirbmon is not lv100, you cannnot evolve it'});
      Eirbdex.findOne({ type: eirbmon.type })
      .then(eirbdex => { 
        if (eirbdex.evolution == "0") return res.send({msg: 'The eirbmon is already at its max evolution, there is no evolution above, it cannnot evolve.'})
        res.json(eirbdex)}) 
        }) // fermeture then 2
      .catch(err => {res.status(500).send({msg: err.message})})
  .catch(err => {res.status(500).send({msg: err.message})})
}

const updateMongoEirbmonAccordingToBlockchain = function (res, idEirbmonBlockchain, Collection) {
  console.log('update the Eirbmon');
    blockchainCtrl.getEirbmonById(idEirbmonBlockchain, function (_Eirbmon) {
      blockchainCtrl.parseEirbmon(_Eirbmon,(_parseEirbmon)=>{
        Collection.findOneAndUpdate({ idInBlockchain: idEirbmonBlockchain }, _parseEirbmon[0], { new: true })
        .then(object => res.json(object))
        .catch(err => res.status(404).json({msg: err + ' req: Update'}))
      })  
    })
}

const updateMongoEirbmonOwnerAccordingToBlockchain = function (idEirbmonBlockchain, Eirbmon, previousOwner,newOwner) {
  console.log('update the Eirbmon Owner')
  return new Promise(function (resolve, reject) {
    console.log("We're here");
      blockchainCtrl.getEirbmonById(idEirbmonBlockchain, function (_Eirbmon) {
        blockchainCtrl.parseEirbmon(_Eirbmon,(_parseEirbmon)=>{
        console.log('update :'+_parseEirbmon[0].owner)
        if (_parseEirbmon[0].owner !== previousOwner.toLowerCase() && _parseEirbmon[0].owner === newOwner.toLowerCase()) {
          Eirbmon.updateOne({ idInBlockchain: idEirbmonBlockchain }, { owner_id: _parseEirbmon[0].owner.toLowerCase(),available : true}, function (err, res) {
            if (err) throw err
            Eirbmon.find({idInBlockchain: idEirbmonBlockchain}).then (data =>{
              resolve(data)
            })      
          })
        }else{
          reject(new Error('Eirbmon not found in the blockchain'))
        }
      })
    })
  })
}

// attend qu'un nouvel Eirmon soit créé pour l'ajouter à mongo
const waitNewEirbmon = function (Eirbmon) {

  console.log('wait the creation of an new Eirbmon')
  return new Promise(function (resolve, reject) {
    SkillCtrl.GetAllSkill(Skill).then((skill)=>{

    Eirbmon.countDocuments().then((count) => {
          console.log(count)
          blockchainCtrl.getEirbmonById(count + 1, (_Eirbmon) => {
            blockchainCtrl.parseEirbmon(_Eirbmon,(_parseEirbmon)=>{
            console.log(_parseEirbmon[0].id)
            if (_parseEirbmon[0].id !== 0) {
              const eirbmonToSave = {
                idInBlockchain: _parseEirbmon[0].id,
                type: _parseEirbmon[0].name,
                name: _parseEirbmon[0].name,
                owner_id: _parseEirbmon[0].owner.toLowerCase(),
                hp: _parseEirbmon[0].hp,
                canBeExhangedTo : _parseEirbmon[0].canBeExhangedTo,
                price : _parseEirbmon[0].price,
                canBeSelled : _parseEirbmon[0].canBeSelled,
                field: _parseEirbmon[0].field,
                evole: _parseEirbmon[0].evole,
                lvl: 0,
                skills_id: [_parseEirbmon[0].atk[0],_parseEirbmon[0].atk[1],_parseEirbmon[0].atk[2]],
                skills : [skill.find(value => value.id == _parseEirbmon[0].atk[0]),skill.find(value => value.id == _parseEirbmon[0].atk[1]),skill.find(value => value.id == _parseEirbmon[0].atk[2])],
                value : _parseEirbmon[0].value,
               }
              Eirbmon.create(eirbmonToSave, function (err, res) {
                if (err) throw err
                console.log("a new eirbmon have been saved")
                resolve(eirbmonToSave.owner_id)
              })
            }
          })
        })
    })
  })
})
}

const catchEirbmon = function (req, res, Eirbmon) {
  console.log("We're here 0");
  req.params.owner_id = req.body.owner_id
  var catchedEirbmon;
  var tabProm = [
    updateMongoEirbmonOwnerAccordingToBlockchain(req.body.id_eirbmon_blockchain, Eirbmon, '0x0000000000000000000000000000000000000000',req.params.owner_id).then(data => {console.log(data); return catchedEirbmon = data}),
    waitNewEirbmon(Eirbmon).then(data => console.log('wait'+data))
  ]
  console.log("We're here 2");
  Promise.all(tabProm).then(() => { res.json(catchedEirbmon) }, (error) => res.json(error))
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
  waitNewEirbmon(Eirbmon).then(()=>waitNewEirbmon(Eirbmon)).then(() => GetAllEirbmonsByOwner(req, res, Eirbmon, 'Eirbmon'), () => console.log('error'))
}

const getEirmonForSale = function(req,res,Eirbmon){
  console.log('Request get for sale');
  if (!req.params.owner_id) {
    Eirbmon.findOne({ canBeSelled: true})
    .then(data => {
      res.json(data)
    })
    .catch(err => {res.status(500).send({msg: err.message})})
  }else{
    Eirbmon.findOne({ canBeSelled: true,owner_id:req.params.owner_id})
    .then(data => {
      res.json(data)
    })
    .catch(err => {res.status(500).send({msg: err.message})})
  }
  
}

const setEirmonForSale = function (req, res, Eirbmon) {
  console.log('Request get for sale');
  blockchainCtrl.getEirbmonById(req.body.id_eirbmon_blockchain, function (_EirbmonsFromBlockchain) {
    blockchainCtrl.parseEirbmon(_EirbmonsFromBlockchain, (_parseEirbmon) => {
      if (_parseEirbmon[0].canBeSelled == true) {
        Eirbmon.updateOne({ idInBlockchain: req.body.id_eirbmon_blockchain }, { canBeSelled: true, price :_parseEirbmon[0].price })
          .then(data => {
            res.json({ msg : "The eirbmon is now for sale" })
          })
          .catch(err => { res.status(500).send({ msg: err.message }) })
      }else{
        return res.status(500).send({ msg: 'The Eirbmon can not be saled' })
      }
    })
  })
}

const unsaleEirmon = function(req,res,Eirbmon){
  console.log('Request unsale');
  blockchainCtrl.getEirbmonById(req.body.id_eirbmon_blockchain, function (_EirbmonsFromBlockchain) {
    blockchainCtrl.parseEirbmon(_EirbmonsFromBlockchain, (_parseEirbmon) => {
      if (_parseEirbmon[0].canBeSelled == true) {
        Eirbmon.updateOne({ idInBlockchain: req.body.id_eirbmon_blockchain }, { canBeSelled: false })
          .then(data => {
            res.json({ msg : "The eirbmon is now for unsale" })
          })
          .catch(err => { res.status(500).send({ msg: err.message }) })
      }else{
        return res.status(500).send({ msg: 'The Eirbmon can not be unsaled' })
      }
    })
  })
}

const UpdateOneEirbmon = function(req, res, Eirbmon){
  req.params.owner_id = req.body.owner_id

  SkillCtrl.GetAllSkill(Skill).then((skill)=>{
    console.log('update an Eirbmon')
    blockchainCtrl.getEirbmonById(req.body.id_eirbmon_blockchain, function (_EirbmonsFromBlockchain) {
      blockchainCtrl.parseEirbmon(_EirbmonsFromBlockchain,(_parseEirbmon)=>{
          _EirbmonToSave = {
            idInBlockchain: _parseEirbmon[0].id,
            type: _parseEirbmon[0].name,
            name: _parseEirbmon[0].name,
            owner_id: _parseEirbmon[0].owner.toLowerCase(),
            hp: _parseEirbmon[0].hp,
            canBeExhangedTo : _parseEirbmon[0].canBeExhangedTo,
            price : _parseEirbmon[0].price,
            canBeSelled : _parseEirbmon[0].canBeSelled,
            field: _parseEirbmon[0].field,
            evole: _parseEirbmon[0].evole,
            lvl: 0,
            skills_id: [_parseEirbmon[0].atk[0],_parseEirbmon[0].atk[1],_parseEirbmon[0].atk[2]],
            skills : [skill.find(value => value.id == _parseEirbmon[0].atk[0]),skill.find(value => value.id == _parseEirbmon[0].atk[1]),skill.find(value => value.id == _parseEirbmon[0].atk[2])],
            value : _parseEirbmon[0].value,
            created_date : moment.unix(_parseEirbmon[0].birthDate).toDate(),
          }
          console.log(_EirbmonToSave)
          Eirbmon.updateOne({ idInBlockchain: _EirbmonToSave.idInBlockchain }, _EirbmonToSave, { 'upsert': true }, function (err, res) {
            if (err) throw err
          })
        .then(()=>GetAllEirbmonsByOwner(req, res, Eirbmon, 'Eirbmon'));
      }) 
    })
  })
}

module.exports = {
  updateMongoEirbmonAccordingToBlockchain: updateMongoEirbmonAccordingToBlockchain,
  addFirstEirbmon: addFirstEirbmon,
  findMyEvolution: findMyEvolution,
  GetAnyEirbmonsByOwner: GetAnyEirbmonsByOwner,
  GetAllEirbmonsByOwner: GetAllEirbmonsByOwner,
  GetEirbmonByidInBlockchain: GetEirbmonByidInBlockchain,
  Update: Update,
  GetAllEirbmons: GetAllEirbmons,
  UpdateEirbmonTable: UpdateEirbmonTable,
  getEirbmonById: getEirbmonById,
  catchEirbmon: catchEirbmon,
  updateOwner: updateOwner,
  getEvolve: getEvolve,
  exchangeEirbmon: exchangeEirbmon,
  resetEirbmonTable: resetEirbmonTable,
  getEirmonForSale,
  setEirmonForSale,
  unsaleEirmon,
  UpdateOneEirbmon
}
