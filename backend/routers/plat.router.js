var express = require('express');
var mongoose = require('mongoose');

var router = module.exports = express.Router();
var Plat = mongoose.model('Plat');

router.post('/save', function(req, res) {
  if (!req.body.nom) {
    res.status(500).send("fields");
    return;
  }
  var plat = new Plat(req.body);
  plat.save(function(err, plat2) {
    if (err) res.status(500).json(err);
    else {
      res.status(200).json(plat2);
    }
  });
});
