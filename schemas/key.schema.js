const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const KeySchema = new Schema({
  key : {type:String,required: true},
  available: {type: Boolean, default : true}
});

module.exports = mongoose.model('Key', KeySchema, 'keys');
