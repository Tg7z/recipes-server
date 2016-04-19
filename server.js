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

// Models
import Recipe from './src/models/Recipe';

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

// configure app to use bodyParser()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//===============ROUTES===============
const router = express.Router();

router.get('/', function(req, res) {
  res.json({ message: 'It works!' });
});

//
const recipesRoute = router.route('/recipes');

// Create endpoint /api/v1/recipes for GET
recipesRoute.get(function(req, res) {
  Recipe.find(function(err, recipes) {
    if (err) res.send(err);

    res.json(recipes);
  });
});

// Create endpoint /api/v1/recipes for POST
recipesRoute.post(function(req, res) {
  const recipe = new Recipe();
  const d = req.body;

  // Set the recipe properties that came from the POST data
  recipe.title = d.title;
  recipe.author = d.author;
  recipe.imageurl = d.imageurl;
  recipe.faves = d.faves;
  recipe.method = d.method;
  recipe.ingredients = d.ingredients;
  recipe.updated = d.updated;
  recipe.isPublished = d.isPublished;

  recipe.save(function(err) {
    if (err) res.send(err);

    res.json({ message: 'Recipe added!', data: recipe });
  });
});

// Create a new route with the /recipes/:recipe_id prefix
var recipeRoute = router.route('/recipes/:recipe_id');

// Create endpoint /api/v1/recipes/:recipe_id for GET
recipeRoute.get(function(req, res) {
  Recipe.findById(req.params.recipe_id, function(err, recipe) {
    if (err) res.send(err);

    res.json(recipe);
  });
});

// Create endpoint /api/v1/recipes/:recipe_id for PUT
recipeRoute.put(function(req, res) {
  const d = req.body;

  Recipe.findById(req.params.recipe_id, function(err, recipe) {
    if (err) res.send(err);

    // Update the recipe properties that came from the PUT data
    if (d.title) recipe.title = d.title;
    if (d.author) recipe.author = d.author;
    if (d.imageurl) recipe.imageurl = d.imageurl;
    if (d.faves) recipe.faves = d.faves;
    if (d.method) recipe.method = d.method;
    if (d.ingredients) recipe.ingredients = d.ingredients;
    if (d.updated) recipe.updated = d.updated;
    if (d.isPublished) recipe.isPublished = d.isPublished;

    recipe.save(function(err) {
      if (err) res.send(err);

      res.json(recipe);
    });
  });
});

// Create endpoint /api/v1/recipes/:recipe_id for DELETE
recipeRoute.delete(function(req, res) {
  Recipe.findByIdAndRemove(req.params.recipe_id, function(err) {
    if (err) res.send(err);

    res.json({ message: 'Recipe deleted' });
  });
});

// REGISTER OUR ROUTES
// all of our routes will be prefixed with /api/${version}
app.use('/api/v1', router);

//===============PORT=================
const port = process.env.PORT || 5000;
app.listen(port);
console.log("listening on " + port + "!");
