const keys = require('../private_key.json')


const addKey = function(req,res,Key){
    Key.deleteMany().then(()=>{
        var data = [];
        keys.forEach(element => {
            data.push({
                key :element.key.slice(element.key.indexOf(')')+2,element.key.length),
                available : true,
                owner_id: "0"
            })
        });
        Key.insertMany(data,()=>{
            res.json(data)
        })
    })
}

const updateKey = function(req,res,Key){
  Key.updateMany({owner_id: "0", available: false},{available: true}).then((data) => res.json(data));
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
    Key.findOneAndUpdate({key:req.body.key},req.body,{ new: true })
    .then(_keys =>{
        res.json(_keys)
      }).catch(err => {
        res.status(500).send({
          msg: err.message
        })
      })
}

const availableKey = function(req,res,Key){    
    Key.findOne({available:true})
    .then(_keys =>{
      Key.updateOne({key:_keys},{available:false})
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
    updateKey:updateKey,
    availableKey:availableKey
}