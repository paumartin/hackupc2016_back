var express = require('express');
var router = module.exports = express.Router();

router.post('/save', function(req, res) {
  if (!req.body.nom) {
    res.status(500).send("fields");
    return;
  }

  var db = req.db;
  var collection = db.get('plat');
  collection.insert({
    "nom" : req.body.nom,
    "descipcio" : req.body.descripcio,
    "ingredients" : req.body.ingredients,
    "foto" : req.body.foto
  }, function(err, doc) {
    if (err) {
      res.send(err);
    } else {
      res.status(200).json(req.body);
    }
  });
});

router.get('/getList', function(req, res) {
  var db = req.db;
  var collection = db.get('plat');
  collection.find({}, {}, function(err, data) {
    if (err) {
      res.send(err);
    } else {
      res.status(200).json(data);
    }
  });
});
