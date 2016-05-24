'use strict';
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    type: Object,
    required: true,
  },
});

UserSchema.pre('save', function(callback) {
  const user = this;

  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function (err, salt) {

      if (err) return callback(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
          if (err) return callback(err);

          user.password = hash;
          callback();
      });
    });
  } else {
    return callback();
  }

});

UserSchema.methods.verifyPassword = function(password, cb) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if (err) return cb(err);

    cb(null, isMatch);
  });
};

const ProfileSchema = new mongoose.Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  avatar_url: String,
  firstname: String,
  lastname: String,
  blurb: String,
  recipe_ids: [{
    type: Schema.Types.ObjectId,
    ref: 'Recipe',
  }],
  favourite_ids: [{
    type: Schema.Types.ObjectId,
    ref: 'Recipe',
  }],
});

exports.UserProfile = mongoose.model('Profile', ProfileSchema);
exports.UserAccount = mongoose.model('User', UserSchema);
