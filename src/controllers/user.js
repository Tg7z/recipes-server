'use strict';
import User from '../models/user';
import { getToken } from './auth'

// Create endpoint /api/v1/users for POST
exports.postUsers = function(req, res) {

  // validate request
  if (!req.body.username || !req.body.password) {
    res.json({success: false, msg: 'Please pass name and password.'});
  }

  var user = new User({
    username: req.body.username,
    password: req.body.password
  });

  user.save(function(err) {
    if (err) res.send({ success: false, err: err });

    res.json({ success: true, msg: 'New user created' });
  });
};

// Create endpoint /api/v1/users for GET
exports.getUsers = function(req, res) {
  User.find(function(err, users) {
    if (err) res.send(err);

    res.json(users);
  });
};
