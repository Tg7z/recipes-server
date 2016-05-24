'use strict';
import mongoose from 'mongoose';
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
  }
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

module.exports = mongoose.model('User', UserSchema);
