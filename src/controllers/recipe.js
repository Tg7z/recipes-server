'use strict';
import Recipe from '../models/recipe';
import { getUserId, isOwner } from './auth';

const ownsRecipe = (user_id, recipe_id) => ({ authorId: user_id, _id: recipe_id });

// Create endpoint /api/v1/recipes for GET
exports.getRecipes = function(req, res) {
  Recipe.find(function(err, recipes) {
    if (err) res.send(err);

    res.json(recipes);
  });
};

// Create endpoint /api/v1/recipes for POST
exports.postRecipes = function(req, res) {
  const recipe = new Recipe();
  const d = req.body;

  // Set the recipe properties that came from the POST data
  recipe.title = d.title;
  recipe.imageurl = d.imageurl;
  recipe.faves = d.faves;
  recipe.method = d.method;
  recipe.ingredients = d.ingredients;
  recipe.updated = d.updated;
  recipe.isPublished = d.isPublished;
  recipe.authorId = req.user._id;

  recipe.save(function(err) {
    if (err) res.send(err);

    res.json({ message: 'Recipe added!', data: recipe });
  });
};

// Create endpoint /api/v1/recipes/:recipe_id for GET
exports.getRecipe = function(req, res) {
  Recipe.findById(req.params.recipe_id, function(err, recipe) {
    if (err) res.send(err);

    res.json(recipe);
  });
};

// Create endpoint /api/v1/recipes/:recipe_id for PUT
exports.putRecipe = function(req, res) {
  const { headers, params, body: d } = req;
  const recipe_id = params.recipe_id;
  const user_id = getUserId(headers);
  const recipe = {};

  // Update the recipe properties that came from the PUT data
  if (d.title) recipe.title = d.title;
  if (d.imageurl) recipe.imageurl = d.imageurl;
  if (d.faves) recipe.faves = d.faves;
  if (d.method) recipe.method = d.method;
  if (d.ingredients) recipe.ingredients = d.ingredients;
  if (d.isPublished) recipe.isPublished = d.isPublished;

  Recipe.update(ownsRecipe(user_id, recipe_id), recipe, function(err, num, raw) {
    if (err) res.send(err);

    console.log(err, num, raw);

    res.json({
      success: true,
      message: 'recipe updated',
      num,
    });
  });
};

// Create endpoint /api/v1/recipes/:recipe_id for DELETE
exports.deleteRecipe = function(req, res) {
  const { headers, params } = req;
  const recipe_id = params.recipe_id;
  const user_id = getUserId(headers);

  Recipe.remove(ownsRecipe(user_id, recipe_id), function(err, num, raw) {
    if (err) res.send(err);

    res.json({
      success: true,
      message: 'recipe deleted',
      num,
    });
  });
};
