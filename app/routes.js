// app/routes.js
const Platform = require('../app/models/platform');

module.exports = function(app, passport) {

  // Home page
  app.get('/', (req, res) => res.render('index.ejs'));

  // PROFILE SECTION
  app.get('/profile', isLoggedIn, async (req, res) => {
    try {
      const platforms = await Platform.find().sort({ thumbUp: -1 }).lean();
      res.render('profile.ejs', {
        user: req.user,
        messages: platforms
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error loading platforms');
    }
  });

  // LOGOUT
  app.get('/logout', (req, res) => {
    req.logout(() => res.redirect('/'));
  });

  // LOGIN
  app.get('/login', (req, res) => {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  }));

  // SIGNUP
  app.get('/signup', (req, res) => {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  app.post('/signup', (req, res, next) => {
    console.log('🟢 Signup attempt:', req.body.email);
    next();
  }, passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  // UNLINK LOCAL
  app.get('/unlink/local', isLoggedIn, (req, res) => {
    const user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(() => res.redirect('/profile'));
  });

  // RAWG API route
  app.get('/rawg', async (req, res) => {
    const API_KEY = 'dfb8374ee6124809bde42bb595eb1a75';
    const BASE_URL = `https://api.rawg.io/api/platforms?key=${API_KEY}`;
    try {
      const response = await fetch(BASE_URL);
      if (!response.ok) throw new Error(`RAWG API returned ${response.status}`);
      const data = await response.json();
      res.json(data.results);
    } catch (err) {
      console.error('RAWG API error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // PLATFORM ROUTES
  app.get('/platforms', async (req, res) => {
    try {
      const platforms = await Platform.find({});
      res.json(platforms);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/platforms/upvote', async (req, res) => {
    const { name, slug, games_count } = req.body;
    try {
      const platform = await Platform.findOneAndUpdate(
        { slug },
        { $inc: { thumbUp: 1 }, $setOnInsert: { name, games_count } },
        { upsert: true, new: true }
      );
      res.json(platform);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/platforms/downvote', async (req, res) => {
    const { name, slug, games_count } = req.body;
    try {
      const platform = await Platform.findOneAndUpdate(
        { slug },
        { $inc: { thumbDown: 1 }, $setOnInsert: { name, games_count } },
        { upsert: true, new: true }
      );
      res.json(platform);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // middleware
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/');
  }
};
