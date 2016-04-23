'use strict';
import User from '../models/user';
import { getUserId, isOwner } from './auth';

// Create endpoint /api/v1/users for GET
exports.getUsers = function(req, res) {
  User.find(function(err, users) {
    if (err) res.send(err);

    res.json(users);
  });
};

// Create endpoint /api/v1/users/me for GET
exports.getSelf = function(req, res) {
  const user_id = getUserId(req.headers);

  User.findById(user_id, function(err, user) {
    if (err) res.send(err);

    res.json(user);
  });
};

// Create endpoint /api/v1/users/:user_id for GET
exports.getUser = function(req, res) {
  const query_id = req.params.user_id;

  User.findById(query_id, function(err, user) {
    if (err) res.send(err);

    res.json(user);
  });
};


