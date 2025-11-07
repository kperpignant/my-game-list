//---------CHATGPT Helped------------
//-----------------------------------
const fetch = require('node-fetch');
const API_KEY = process.env.RAWG_KEY;
console.log("RAWG API Key Loaded:", process.env.RAWG_KEY ? "Yes" : "No");

const Platform = require('../app/models/platform');

module.exports = function(app, passport) {

  // Home page
  app.get('/', (req, res) => res.render('index.ejs'));

  // PROFILE SECTION
  app.get('/profile', isLoggedIn, async (req, res) => {
  try {
    const platforms = await Platform.find().sort({ thumbUp: -1 }).lean();

    // If database is empty, fetch from RAWG once
    if (platforms.length === 0) {
      console.log('No platforms found in DB — seeding from RAWG...');
      // const API_KEY = process.env.RAWG_KEY;
      const response = await fetch(`https://api.rawg.io/api/platforms?key=${API_KEY}`);
      const data = await response.json();

      const seeded = await Platform.insertMany(
        data.results.map(p => ({
          name: p.name,
          slug: p.slug,
          games_count: p.games_count,
          thumbUp: 0,
          thumbDown: 0
        }))
      );

      console.log(`Seeded ${seeded.length} platforms`);
      return res.render('profile.ejs', {
        user: req.user,
        messages: seeded
      });
    }

    res.render('profile.ejs', { user: req.user, messages: platforms });
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
    console.log('Signup attempt:', req.body.email);
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
    const API_KEY = process.env.RAWG_API_KEY;
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
    console.log('Fetching all RAWG platforms...');
    let allPlatforms = [];
    let nextUrl = `https://api.rawg.io/api/platforms?key=${API_KEY}`;

    // RAWG paginates results — fetch all pages
    while (nextUrl) {
      const response = await fetch(nextUrl);
      if (!response.ok) throw new Error(`RAWG API returned ${response.status}`);
      const data = await response.json();
      allPlatforms = allPlatforms.concat(data.results);
      nextUrl = data.next; // continue until no more pages
    }

    console.log(`Loaded ${allPlatforms.length} total platforms.`);
    res.json(allPlatforms);
  } catch (err) {
    console.error('Error fetching RAWG platforms:', err);
    res.status(500).json({ error: err.message });
  }
});


  // app.put('/platforms/upvote', async (req, res) => {
  //   const { name, slug, games_count } = req.body;
  //   try {
  //     const platform = await Platform.findOneAndUpdate(
  //       { slug },
  //       { $inc: { thumbUp: 1 }, $setOnInsert: { name, games_count } },
  //       { upsert: true, new: true }
  //     );
  //     res.json(platform);
  //   } catch (err) {
  //     res.status(500).json({ error: err.message });
  //   }
  // });

  // app.put('/platforms/downvote', async (req, res) => {
  //   const { name, slug, games_count } = req.body;
  //   try {
  //     const platform = await Platform.findOneAndUpdate(
  //       { slug },
  //       { $inc: { thumbDown: 1 }, $setOnInsert: { name, games_count } },
  //       { upsert: true, new: true }
  //     );
  //     res.json(platform);
  //   } catch (err) {
  //     res.status(500).json({ error: err.message });
  //   }
  // });

// Fetch games for a specific platform
// Fetch top 10 games for a specific platform
app.get('/games/:platformSlug', async (req, res) => {
  const { platformSlug } = req.params;
  try {
    console.log(`Fetching top games for platform: ${platformSlug}`);

    // Find platform ID from RAWG
    const platformRes = await fetch(`https://api.rawg.io/api/platforms?key=${API_KEY}`);
    const platformData = await platformRes.json();
    const platform = platformData.results.find(p => p.slug === platformSlug);

    if (!platform) {
      return res.status(404).json({ error: 'Platform not found' });
    }

    // Fetch games ordered by rating (descending)
    const gamesRes = await fetch(
      `https://api.rawg.io/api/games?key=${API_KEY}&platforms=${platform.id}&ordering=-rating&page_size=10`
    );

    if (!gamesRes.ok) throw new Error(`RAWG games fetch failed: ${gamesRes.status}`);
    const gamesData = await gamesRes.json();

    res.json(gamesData.results || []);
  } catch (err) {
    console.error('Error fetching games:', err);
    res.status(500).json({ error: err.message });
  }
});



  // middleware
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/');
  }
};
