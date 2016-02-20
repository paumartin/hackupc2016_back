// var express = require('express');
// var mongoose = require('mongoose');
//
// var router = module.exports = express.Router();
//
// router.post('/save', function(req, res) {
//   if (!req.body.nom) {
//     res.status(500).send("fields");
//     return;
//   }
//   var menu = new Menu(req.body);
//   menu.save(function(err, menu2) {
//     if (err) res.status(500).json(err);
//     else {
//       res.status(200).json(menu2);
//     }
//   });
// });
//
// router.post('/modify', function(req, res) {
//   if (!req.body.nom) {
//     res.status(500).send("fields");
//     return;
//   }
//   var menu = new Menu(req.body);
//   Menu.find({_id: menu._id}, function(err, oldMenu) {
//     if (err) res.status(500).json(err);
//     else {
//
//     }
//   });
// });
