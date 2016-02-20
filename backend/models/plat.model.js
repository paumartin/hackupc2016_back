var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function() {
  var PlatSchema = new Schema({
    id: { type: String, required: true, trim: true, unique: true },
    nom: { type: String, required: true, trim: true },
    descripcio: { type: String, required: true, trim: true },
    foto: { type: String, required: true, trim: true },
    ingredients: [String]
  });

  mongoose.model('Plat', PlatSchema, 'plat');
};
