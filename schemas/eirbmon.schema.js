const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EirbmonSchema = new Schema({
  idInBlockchain : {type: Number, required: true},
  type: {type: String, required: true}, 
  name: {type: String}, 
  owner_id: {type: String, required: true}, 
  skills_id: {type: Array},
  field: {type: String}, 
  hp: {type: Number, required: true},
  force: {type: Number, required: true},
  xp: {type: Number},
  lvl: {type: Number},
  created_date: Date,
  updated_date: Date,
  catched_date: Date
});

module.exports = mongoose.model('Eirbmon', EirbmonSchema, 'eirbmons');
