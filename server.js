// server.js
//---CHATGPT----
require('dotenv').config();
//---CHATGPT----

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

const configDB = require('./config/database.js');

// ======================================================================
// CONFIGURATION
// ======================================================================
mongoose.connect(configDB.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB with Mongoose'))
  .catch(err => console.error(err));

require('./config/passport')(passport); //MUST come before routes

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');

// sessions
app.use(session({
  secret: 'rcbootcamp2021b',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// ======================================================================
// ROUTES
// ======================================================================
require('./app/routes.js')(app, passport); //no need to pass `db` anymore

// ======================================================================
// LAUNCH
// ======================================================================
app.listen(port, () => console.log(`Server running on port ${port}`));
