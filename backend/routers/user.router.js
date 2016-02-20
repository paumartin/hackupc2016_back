var express = require('express');
var router = module.exports = express.Router();
var bcrypt = require('bcrypt');
var async = require('async');

router.post('/save', function(req, res) {
  if (!req.body.nom || !req.body.email || !req.body.password) {
    res.status(500).send("fields");
    return;
  }
  bcrypt.hash(req.body.password, 12, function(err, hashedPassword) {
    if (err) res.status(500).json(err);
    else {
      req.body.password = hashedPassword;
      var db = req.db;
      var collection = db.collection('users');
      collection.insert({
        "nom" : req.body.nom,
        "email" : req.body.email,
        "password" : req.body.password
      }, function(err, doc) {
        if (err) res.status(500).json(err);
        else {
          res.status(200);
        }
      });
    }
  });
});

router.post('/login', function(req, res) {
  if (!req.body.email || !req.body.password) {
    res.status(500).send("fields");
  } else {
    var email = req.body.email;
    var password = req.body.password;
    var db = req.db;
    var collection = db.collection('users');
    async.waterfall([function(callback) {
      collection.findOne({ email: email }, callback);
    },
    function(user, callback) {
      if (!user) res.status(404).send("User not found");
      else {
        var token = jwt.sign( { email : email, password : password },
        config.JWT_SECRET, { expiresInSeconds : 24 * 60 * 60 * 365 });
        res.status(200).send({ token : token });
      }
    }], function(error) {
      if (error) res.status(500).json(error);
    });
  }
});
