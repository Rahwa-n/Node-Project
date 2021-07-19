var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  menuImage: {type: String, required: true},
  menuName: {type: String, required: true},
  menuDescription: {type: String, required: true},
  price: {type: Number, required: true}
});

module.exports = mongoose.model('Menu', schema);