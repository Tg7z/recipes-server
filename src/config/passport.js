'use strict';
import JWT from 'passport-jwt';
import { UserAccount } from '../models/user';
import config from '../config/database';

const AUTH_HEADER = 'jwt';

exports.AUTH_HEADER = AUTH_HEADER;

exports.config = function(passport) {
  const opts = {};

  opts.secretOrKey = config.secret;
  opts.jwtFromRequest = JWT.ExtractJwt.fromHeader(AUTH_HEADER);

  passport.use(new JWT.Strategy(opts, function(jwt_payload, callback) {
    UserAccount.findOne({id: jwt_payload.id}, function(err, user) {
      if (err) return callback(err, false);

      if (user) {
        callback(null, user);
      } else {
        callback(null, false);
      }
    });
  }));
};
