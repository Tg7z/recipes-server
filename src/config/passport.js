'use strict';
import JWT from 'passport-jwt';
import User from '../models/user';
import config from '../config/database';

module.exports = function(passport) {
  const AUTH_HEADER = 'jwt_token';
  const opts = {};

  opts.secretOrKey = config.secret;
  opts.jwtFromRequest = JWT.ExtractJwt.fromHeader(AUTH_HEADER);

  passport.use(new JWT.Strategy(opts, function(jwt_payload, callback) {
    User.findOne({id: jwt_payload.id}, function(err, user) {
      if (err) return callback(err, false);

      if (user) {
        callback(null, user);
      } else {
        callback(null, false);
      }
    });
  }));
};
