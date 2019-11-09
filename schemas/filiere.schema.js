const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Filiere = new Schema({
  name: {type: String, required: true}
});

module.exports = mongoose.model('Filiere', Filiere, 'filiere');
