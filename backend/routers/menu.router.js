var express = require('express');
var router = module.exports = express.Router();
var mongo = require('mongodb');

router.post('/save', function(req, res) {
  if (!req.body.nom) {
    res.status(500).send("fields");
    return;
  }

  var db = req.db;
  var collection = db.collection('menu');
  collection.insert({
    "nom" : req.body.nom,
    "descripcio" : req.body.descripcio,
    "dinars" : req.body.dinars,
    "sopars" : req.body.sopars
  }, function(err, doc) {
    if (err) {
      res.status(500).json(err);
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
  var collection = db.collection('menu');
  var o_id = mongo.ObjectID(req.body._id);
  collection.update({_id: o_id}, {$set: {
    "nom" : req.body.nom,
    "descripcio" : req.body.descripcio,
    "dinars" : req.body.dinars,
    "sopars" : req.body.sopars
  }}, function(err, result) {
    if (err) {
      res.send(err);
    } else {
      res.status(200).json(result);
    }
  });
});

router.get('/getList', function(req, res) {
  var db = req.db;
  var collection = db.collection('menu');
  collection.find().toArray(function(err, data) {
    if (err) {
      res.send(err);
    } else {
      res.status(200).json(data);
    }
  });
});

router.post('/delete', function(req, res) {
  if (!req.body._id) {
    res.status(500).send("fields");
    return;
  }
  var collection = req.db.collection('menu');
  var o_id = mongo.ObjectID(req.body._id);
  collection.remove({ _id : o_id }, function(err, result) {
    if (err) res.status(500).json(err);
    else res.status(200).json(result);
  });
});
