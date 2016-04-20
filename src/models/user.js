'use strict';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

UserSchema.pre('save', function(callback) {
  const user = this;

  // Break out if the password hasn't changed
  if (!user.isModified('password')) return callback();

  // Password changed so we need to hash it
  bcrypt.genSalt(5, (err, salt) => {
    if (err) return callback(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return callback(err);

      user.password = hash;
      callback();
    });
  });
});

module.exports = mongoose.model('User', UserSchema);
