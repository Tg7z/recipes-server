'use strict';
import passport from 'passport';

exports.requireAuth = (session = false) => passport.authenticate('jwt', { session });
