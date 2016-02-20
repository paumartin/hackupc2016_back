var express = require('express');
var router = module.exports = express.Router();
var mongo = require('mongodb');

router.post('/save', function(req, res) {
  if (!req.body.nom) {
    res.status(500).send("fields");
    return;
  }

  var db = req.db;
  var collection = db.collection('plat');
  collection.insert({
    "nom" : req.body.nom,
    "descripcio" : req.body.descripcio,
    "ingredients" : req.body.ingredients,
    "foto" : req.body.foto
  }, function(err, doc) {
    if (err) {
      throw err;
    } else {
      res.status(200).json(req.body);
    }
  });
});

router.post('/update', function(req, res) {
  if (!req.body._id || !req.body.nom) {
    res.status(500).send("fields");
    return;
  }
  var db = req.db;
  var collection = db.collection('plat');
  var o_id = mongo.ObjectID(req.body._id);
  collection.update({_id: o_id}, {$set:{
    nom : req.body.nom,
    descipcio : req.body.descripcio,
    ingredients : req.body.ingredients,
    foto : req.body.ingredients }}, function(err, result) {
      if (err) {
        res.send(err);
      } else {
        res.status(200).json(result);
      }
  });
});

router.get('/getList', function(req, res) {
  var db = req.db;
  var collection = db.collection('plat');
  collection.find().toArray(function(err, data) {
    if (err) {
      res.send(err);
    } else {
      res.status(200).json(data);
    }
  });
});
