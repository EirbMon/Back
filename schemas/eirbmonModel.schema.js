const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EirbmonModelSchema = new Schema({
  name: {type: String, required: true},
  pathImage: {type: String, required: true}
});

module.exports = mongoose.model('EirbmonModel', EirbmonModelSchema, 'eirbmonModel');
