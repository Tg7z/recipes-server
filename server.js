'use strict';
import express from 'express';
import mongoose from 'mongoose';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import session from 'express-session';
import passport from 'passport';

// App config
import dbConfig from './src/config/database';
import { config as passportConfig, AUTH_HEADER } from './src/config/passport';
import routeConfig from './src/config/routes';
import whitelist from './src/config/whitelist';

// Connect to the MongoDB
mongoose.connect(dbConfig.database);




//===============PASSPORT===============
passportConfig(passport);




//===============EXPRESS================
const app = express();

// Configure Express
app.use(function(req, res, next) {
  const origin = req.headers.origin;

  if ( whitelist.indexOf(origin) > -1 ) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  // res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', `Content-Type, ${AUTH_HEADER}`);
  res.header('Access-Control-Allow-Credentials', true);

  return next();
});

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
routeConfig(app);




//===============PORT=================
const port = process.env.PORT || 5000;
app.listen(port);
console.log("listening on " + port + "!");
