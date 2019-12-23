const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EirbmonSchema = new Schema({
  idInBlockchain : {type: Number, required: true},
  type: {type: String, required: true}, 
  name: {type: String}, 
  owner_id: {type: String, required: true}, 
  skills_id: {type: Array},
  field: {type: String}, 
  hp: {type: Number},
  current_hp: {type: Number},
  canBeExhangedTo: {type: Number},
  price: {type: Number},
  canBeSelled: {type: Boolean},
  force: {type: Number, default :0},
  lvl: {type: Number},
  evolve: {type: Number, default: 1},
  created_date: Date,
  updated_date: Date,
  catched_date: Date,
  available: {type: Boolean, default : true},
  value :{type : Number}
});

module.exports = mongoose.model('Eirbmon', EirbmonSchema, 'eirbmons');
