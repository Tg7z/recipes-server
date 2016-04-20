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
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});

module.exports = mongoose.model('Recipe', RecipeSchema);
