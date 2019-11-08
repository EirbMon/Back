const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {type: String, required: true},  // required: true, ceci oblige que ce champ soit remplis (lors d'un POST) sinon erreur
  password: {type: String, required: true},
  username: {type: String, required: true},
  date: Date,
  permission: { type: Number, min: 0, max: 5, required: false },
});

module.exports = mongoose.model('User', UserSchema, 'users');
