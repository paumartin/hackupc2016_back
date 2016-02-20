var express = require('express');
var router = module.exports = express.Router();
var bcrypt = require('bcrypt');
var async = require('async');
var mongo = require('mongodb');
var jwt = require('jsonwebtoken');
var config = require('../config');

router.post('/save', function(req, res) {
  if (!req.body.nom || !req.body.email || !req.body.password) {
    res.status(500).send("fields");
    return;
  }
  var collection = req.db.collection('users');
  async.waterfall([
    function(callback) {
      collection.findOne({ email : req.body.email }, callback);
    },
    function(user, callback) {
      if (user) res.status(500).send("There's a user with the same email");
      else {
        bcrypt.hash(req.body.password, 12, function(err, hashedPassword) {
          if (err) res.status(500).json(err);
          else {
            req.body.password = hashedPassword;
            collection.insert({
              "nom" : req.body.nom,
              "email" : req.body.email,
              "password" : req.body.password
            }, function(err, doc) {
              if (err) res.status(500).json(err);
              else {
                res.status(200).json(doc);
              }
            });
          }
        });
      }
    }
  ]);
});

router.post('/login', function(req, res) {
  if (!req.body.email || !req.body.password) {
    res.status(500).send("fields");
  } else {
    var email = req.body.email;
    var password = req.body.password;
    var db = req.db;
    var collection = db.collection('users');
    async.waterfall([
    function(callback) {
      collection.findOne({ email: email }, callback);
    },
    function(user, callback) {
      if (!user) res.status(404).send("User not found");
      else bcrypt.compare(password, user.password, callback);
    },
    function(equalsPasswords, callback) {
      if (!equalsPasswords) res.status(401).send("Wrong password");
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

router.post('/update', function(req, res) {
  if (!req.body._id || !req.body.nom || !req.body.email) {
    res.status(500).send("fields");
    return;
  }
  var collection = req.db.collection('users');
  var o_id = mongo.ObjectID(req.body._id);
  collection.update({_id : o_id}, {$set : {
    "nom" : req.body.nom,
    "email" : req.body.email
  }}, function(err, result) {
    if (err) res.status(500).json(err);
    else res.status(200).json(result);
  });
});

router.post('/changePassword', function(req, res) {
  if (!req.body._id || !req.body.oldPassword || !req.body.newPassword) {
    res.status(500).send("fields");
    return;
  }

  var collection = req.db.collection('users');
  var o_id = mongo.ObjectID(req.body._id);
  async.waterfall([
    function(callback) {
      collection.findOne({_id : o_id}, callback);
    },
    function(user, callback) {
      if (!user) res.status(404).send("User not found");
      else bcrypt.compare(req.body.oldPassword, user.password, callback);
    },
    function(equalsPasswords, callback) {
      if (!equalsPasswords) res.status(401).send("Wrong password");
      else {
        bcrypt.hash(req.body.newPassword, 12, function(err, hashedPassword) {
          if (err) res.status(500).json(err);
          else {
            collection.update({ _id : o_id }, { $set: { "password" : hashedPassword } }, function(err, result) {
              if (err) res.status(500).json(err);
              else res.status(200).json(result);
            });
          }
        });
      }
    }
  ]);
});

router.get('/getList', function(req, res) {
  var collection = req.db.collection('users');
  collection.find({}).toArray(function(err, data) {
    if (err) res.status(500).json(err);
    else res.status(200).json(data);
  });
});

router.post('/delete', function(req, res) {
  if (!req.body._id) {
    res.status(500).send("fields");
    return;
  }
  var collection = req.db.collection('users');
  var o_id = mongo.ObjectID(req.body._id);
  collection.remove({ _id : o_id}, function(err, result) {
    if (err) res.status(500).json(err);
    else res.status(200).json(result);
  });
});
