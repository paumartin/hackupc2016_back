var express = require('express');
var router = module.exports = express.Router();
var mongo = require('mongodb');

/* --- UPLOAD FILES --- */
var multer = require('multer');
// var upload = multer().single('avatar')
/* --- UPLOAD FILES --- */

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
    "ingredients" : req.body.ingredients
  }, function(err, doc) {
    if (err) {
      throw err;
    } else {
      res.status(200).json(doc.insertedIds);
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

router.post('/delete', function(req, res) {
  if (!req.body._id) {
    res.status(500).send("fields");
    return;
  }
  var collection = req.db.collection('plat');
  var o_id = mongo.ObjectID(req.body._id);
  collection.remove({ _id : o_id }, function(err, result) {
    if (err) res.status(500).json(err);
    else res.status(200).json(result);
  });
});

router.post('/uploadPhoto/:platId', function(req, res) {
  var id = mongo.ObjectID(req.params.platId);
  var fileName = 'foto' + '-' + Date.now();
  var storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './uploads');
    },
    filename: function (req, file, callback) {
      callback(null, fileName);
    }
  });
  var upload = multer({ storage : storage }).single('foto');

  upload(req, res, function(err) {
    if (err) res.status(500).json(err);
    else {
      var collection = req.db.collection('plat');
      collection.update({ _id : id }, {$set : { foto : fileName }}, function(err, result) {
        if (err) res.status(500).json(err);
        else res.status(200).send("Image Uploaded");
      });
    }
  });
});
