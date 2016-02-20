var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function() {
  var PlatSchema = new Schema({
    nom: { type: String, required: true, trim: true },
    descripcio: { type: String, trim: true },
    foto: { type: String, trim: true },
    ingredients: [String]
  });

  mongoose.model('Plat', PlatSchema, 'plat');
};
