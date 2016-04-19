'use strict';
import express from 'express';
import mongoose from 'mongoose';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import TwitterStrategy from 'passport-twitter';
import GoogleStrategy from 'passport-google';
import FacebookStrategy from 'passport-facebook';

// Controllers
import * as recipeController from './src/controllers/recipe';

// Connect to the MongoDB
mongoose.connect('mongodb://localhost:27017/recipe-book');

const app = express();




//===============PASSPORT===============

//This section will contain our work with Passport




//===============EXPRESS================
// Configure Express
app.use(logger('combined'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(session({secret: 'supernova', saveUninitialized: true, resave: true}));
app.use(passport.initialize());
app.use(passport.session());

// Session-persisted message middleware
app.use(function(req, res, next){
  const err = req.session.error;
  const msg = req.session.notice;
  const success = req.session.success;

  delete req.session.error;
  delete req.session.success;
  delete req.session.notice;

  if (err) res.locals.error = err;
  if (msg) res.locals.notice = msg;
  if (success) res.locals.success = success;

  next();
});




//===============ROUTES===============
const router = express.Router();

// Create endpoint handlers for /recipes
router.route('/recipes')
  .get(recipeController.getRecipes)
  .post(recipeController.postRecipes);

// Create endpoint handlers for /recipes/:recipe_id
router.route('/recipes/:recipe_id')
  .get(recipeController.getRecipe)
  .put(recipeController.putRecipe)
  .delete(recipeController.deleteRecipe);


// REGISTER OUR ROUTES
// all of our routes will be prefixed with /api/${version}
app.use('/api/v1', router);




//===============PORT=================
const port = process.env.PORT || 5000;
app.listen(port);
console.log("listening on " + port + "!");
