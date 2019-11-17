const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SkillSchema = new Schema({
  name: {type: String, required: true},
  id: {type: Number, required: true},
  pp: {type: Number, required: true},
  damage: {type: Number, required: true},
  field: String
});

module.exports = mongoose.model('Skill', SkillSchema, 'skills');
