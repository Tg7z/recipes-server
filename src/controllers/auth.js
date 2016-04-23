'use strict';
import * as jwt from 'jwt-simple'
import User from '../models/user';
import { default as config } from '../config/database';

// passport.use(new BasicStrategy( function(username, password, callback) {
//   User.findOne({ username: username }, function (err, user) {
//     if (err) { return callback(err); }

//     // No user found with that username
//     if (!user) { return callback(null, false); }

//     // Make sure the password is correct
//     user.verifyPassword(password, function(err, isMatch) {
//       if (err) { return callback(err); }

//       // Password did not match
//       if (!isMatch) { return callback(null, false); }

//       // Success
//       return callback(null, user);
//     });
//   });
// }));

// exports.isAuthenticated = passport.authenticate('basic', { session : false });

exports.authenticate = function(req, res) {
  User.findOne({
    username: req.body.username
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
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
};


exports.getToken = (headers) => {
  if (headers && headers.authorization) {
    const parted = headers.authorization.split(' ');

    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};
