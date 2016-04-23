'use strict';
import express from 'express';

// Controllers
import * as authController from '../controllers/auth';
import * as recipeController from '../controllers/recipe';
import * as userController from '../controllers/user';

// Helpers
import authHelpers from '../helpers/auth';

module.exports = function(app) {
  const apiRouter = express.Router();

  // Create endpoint handlers for /authenticate
  apiRouter.route('/authenticate')
    .post(authController.authenticate);

  // Create endpoint handlers for /users
  apiRouter.route('/users')
    .post(userController.postUsers)
    .get(authHelpers.requireAuth(), userController.getUsers);

  // Create endpoint handlers for /recipes
  apiRouter.route('/recipes')
    .get(recipeController.getRecipes)
    .post(authHelpers.requireAuth(), recipeController.postRecipes);

  // Create endpoint handlers for /recipes/:recipe_id
  apiRouter.route('/recipes/:recipe_id')
    .get(recipeController.getRecipe)
    .put(recipeController.putRecipe)
    .delete(recipeController.deleteRecipe);


  // REGISTER OUR ROUTES
  // all of our routes will be prefixed with /api/${version}
  app.use('/api/v1', apiRouter);
}