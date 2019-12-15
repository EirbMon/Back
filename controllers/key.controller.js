const keys = require('../private_key.json')


const addKey = function(req,res,Key){
    Key.deleteMany().then(()=>{
        var data = [];
        keys.forEach(element => {
            data.push({
                key :element.key.slice(element.key.indexOf(')')+2,element.key.length).toLowerCase(),
                available : true
            })
        });
        Key.insertMany(data,()=>{
            res.json(data)
        })
    })
}

const getKey = function getKey(req,res,Key){    
    Key.find()
    .then(_keys =>{
        res.json(_keys)
      }).catch(err => {
        res.status(500).send({
          msg: err.message
        })
      })
}

const takeKey = function(req,res,Key){    
    Key.updateOne({key:req.body.key.toLowerCase()},{available:false})
    .then(_keys =>{
        res.json({response:'ok'})
      }).catch(err => {
        res.status(500).send({
          msg: err.message
        })
      })
}

const availableKey = function(req,res,Key){    
    Key.find({available:true})
    .then(_keys =>{
        res.json(_keys)
      }).catch(err => {
        res.status(500).send({
          msg: err.message
        })
      })
}



module.exports = {
    addKey:addKey,
    getKey:getKey,
    takeKey:takeKey,
    availableKey:availableKey
}