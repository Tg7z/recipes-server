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

  apiRouter.route('/register')
    .post(authController.register)

  // Create endpoint handlers for /users
  apiRouter.route('/users')
    .get(authHelpers.requireAuth(), userController.getUsers);

  // Create endpoint handlers for /users/:user
  apiRouter.route('/users/:user_id')
    .get(authHelpers.requireAuth(), userController.getUser);
    .put(authHelpers.requireAuth(), userController.putUser);

  // Create endpoint handlers for /recipes
  apiRouter.route('/recipes')
    .get(recipeController.getRecipes)
    .post(authHelpers.requireAuth(), recipeController.postRecipes);

  // Create endpoint handlers for /recipes/:recipe_id
  apiRouter.route('/recipes/:recipe_id')
    .get(recipeController.getRecipe)
    .put(authHelpers.requireAuth(), recipeController.putRecipe)
    .delete(authHelpers.requireAuth(), recipeController.deleteRecipe);


  // REGISTER OUR ROUTES
  // all of our routes will be prefixed with /api/${version}
  app.use('/api/v1', apiRouter);
}
