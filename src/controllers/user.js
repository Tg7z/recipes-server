// The User controller relies primarily on the UserProfile model
// rather than the private auth data stored in the UserAccount model

'use strict';
import { UserProfile } from '../models/user';
import { getUserId, isOwner } from './auth';

// Create endpoint /api/v1/users for GET
exports.getUsers = function(req, res) {
  UserProfile.find(function(err, users) {
    if (err) res.send(err);

    res.json(users);
  });
};

// Create endpoint /api/v1/users/:user_id for GET
exports.getUser = function(req, res) {
  const query_id = req.params.user_id;

  UserProfile.findById(query_id, function(err, user) {
    if (err) res.send(err);

    res.json(user);
  });
};

// Create endpoint /api/v1/users/:user_id for PUT
// auth handles initial POST of this content
exports.putUser = function(req, res) {
  const { headers, params, body: d } = req;
  const user_id = params.user_id;
  const auth_id = getUserId(headers);
  const user = {};
  const conditions = { user_id: auth_id };

  // fail if trying to edit other user's profile
  if (user_id !== auth_id) {
    res.json({
      success: false,
      message: 'No Access',
    });
  }

  // Update the user profile that came from the PUT data
  if (d.username) user.username = d.username;
  if (d.avatar_url) user.avatar_url = d.avatar_url;
  if (d.firstname) user.firstname = d.firstname;
  if (d.lastname) user.lastname = d.lastname;
  if (d.blurb) user.blurb = d.blurb;

  UserProfile.update(conditions, user, function(err, num, raw) {
    if (err) res.send(err);

    if (num.n) {
      res.json({
        success: true,
        message: 'Profile updated',
        num,
      });
    } else {
      res.json({
        success: false,
        message: 'Something went wrong',
      });
    }
  });
};
