const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EirbmonSchema = new Schema({
  name: {type: String, required: true}, 
  userOwnerId: {type: String, required: true}, 
  filiereId: {type: String, required: true},
  pv: {type: Number, required: true},
  attaque: {type: Number, required: true},
  xp: {type: Number},
  lvl: {type: Number},
  date: Date
});

module.exports = mongoose.model('Eirbmon', EirbmonSchema, 'eirbmon');
