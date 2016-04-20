'use strict';
import mongoose from 'mongoose';

const RecipeSchema = new mongoose.Schema({
  title: String,
  authorId: String,
  imageurl: String,
  method: String,
  ingredients: [{
    name: String,
    measure: String,
  }],

  faves: Number,
  isPublished: { type: Boolean, default: false },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Recipe', RecipeSchema);
