const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EirbdexSchema = new Schema({
  id:  {type: Number},
  type: {type: String}, 
  evolution: {type: String},
  under_evolution: {type: String},
  image: {type: String},
  rarity:  {type: Number}
});

module.exports = mongoose.model('Eirbdex', EirbdexSchema, 'eirbdex');
