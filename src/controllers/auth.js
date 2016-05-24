'use strict';
import * as jwt from 'jwt-simple'
import User from '../models/user';
import { default as config } from '../config/database';
import { AUTH_HEADER } from '../config/passport';

const getToken = (headers) => {
  if (headers && headers[ AUTH_HEADER ]) {
    return headers[ AUTH_HEADER ];
  } else {
    return null;
  }
};

const decodeToken = (token) => jwt.decode(token, config.secret);

// Create endpoint /api/v1/authenticate for POST
exports.authenticate = (req, res) => {
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.verifyPassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          const token = jwt.encode(user, config.secret);
          // return the information including token as JSON
          res.json({success: true, token: token});
        } else {
          res.send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
};

// Create endpoint /api/v1/register for POST
exports.register = function(req, res) {
  const { email, password } = req.body;
  const roles = ['user'];

  // validate request
  if (!email || !password) {
    res.json({success: false, msg: 'Please pass email and password.'});
  }

  const user = new User({
    email,
    password,
    roles,
  });

  user.save(function(err) {
    if (err) res.send({ success: false, err: err });

    res.json({ success: true, msg: 'New user created' });
  });
};

exports.isOwner = (item_id, headers) => {
  const user_id = getUserId(headers);

  if (item_id === user_id) return true;

  return false;
};

exports.getUserId = (headers) => {
  const token = getToken(headers);
  const decoded = decodeToken(token);

  return decoded._id;
};
