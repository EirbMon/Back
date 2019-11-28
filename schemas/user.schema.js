const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  wallet_id:  {type: String},
  email: {type: String, required: true}, 
  password: {type: String, required: true},
  name: {type: String, required: true},
  created_date: Date,
  permission: { type: Number, min: 0, max: 5},
  token: {type: String}, 
  key: {type: String}, // ???
  addrBlockchain: {type: String} // ???
});

module.exports = mongoose.model('User', UserSchema, 'users');
