const express = require('express');
const router = express.Router();
const userReg = require('../models/users');
const adminReg = require('../models/admin');
const homeController = require('../controllers/home.controller');
const adminHomeController = require('../controllers/adminHome.controller');
const session = require('express-session');
const flash = require('connect-flash');
const cartController = require('../controllers/cart.controller');
const orderController = require('../controllers/order.controller');
const adminOrdersController = require('../controllers/adminOrders.controller');
const statusController = require('../controllers/status.controller');

// Middleware setup
router.use(
  session({
    secret: 'SECRET',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 3600000 }, // 1 hour
  })
);
router.use(flash());

// Authentication middlewares
function isLoggedIn(req, res, next) {
  if (req.session?.user?._id) {
    return next();
  }
  req.flash('error', 'You must be logged in to access this page');
  res.redirect('/login');
}

function isAdminLoggedIn(req, res, next) {
  if (req.session?.admin?._id) {
    return next();
  }
  req.flash('error', 'You must be logged in as admin to access this page');
  res.redirect('/adminLogin');
}

// User Routes
router.get('/', homeController().index);
router.get('/cart', cartController().index);

router.get('/prof', isLoggedIn, (req, res) => {
  const success = req.flash('success');
  const error = req.flash('error');
  const { username } = req.session.user;

  res.render('profile', { success, error, user: username });
});

router.get('/login', (req, res) => {
  res.render('auth/login', {
    success: req.flash('success'),
    error: req.flash('error'),
  });
});

router.get('/reg', (req, res) => {
  res.render('auth/register', {
    success: req.flash('success'),
    error: req.flash('error'),
  });
});

// Admin Routes
router.get('/admin', isAdminLoggedIn, adminHomeController().index);

router.get('/adminLogin', (req, res) => {
  res.render('auth/adminLogin', {
    success: req.flash('success'),
    error: req.flash('error'),
  });
});

router.get('/adminReg', (req, res) => {
  res.render('auth/adminReg', {
    success: req.flash('success'),
    error: req.flash('error'),
  });
});

router.get('/adminProf', isAdminLoggedIn, (req, res) => {
  const success = req.flash('success');
  const error = req.flash('error');
  const { username, ID } = req.session.admin;

  res.render('adminProfile', { success, error, admin: { username, ID } });
});

// User Post Routes
router.post('/reg', async (req, res) => {
  try {
    const existingUser = await userReg.findOne({ username: req.body.username });
    if (existingUser) {
      req.flash('error', 'Username already exists');
      return res.status(400).redirect('/reg');
    }

    const registerUser = new userReg(req.body);
    await registerUser.save();
    req.flash('success', 'User registered successfully. Please log in.');
    res.status(201).redirect('/login');
  } catch (error) {
    req.flash('error', error.message);
    res.status(500).redirect('/reg');
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userReg.findOne({ username });
    if (!user || user.password !== password) {
      req.flash('error', 'Invalid username or password');
      return res.redirect('/login');
    }

    req.session.user = { _id: user._id, username: user.username };
    req.flash('success', 'Login successful!');
    res.redirect('/');
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('/login');
  }
});

router.post('/prof', isLoggedIn, async (req, res) => {
  try {
    const { username, currentPassword, newPassword, confirmPassword } =
      req.body;
    const user = await userReg.findById(req.session.user._id);

    if (!user) throw new Error('User not found');
    if (currentPassword && user.password !== currentPassword) {
      throw new Error('Incorrect current password');
    }

    if (newPassword && newPassword !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    if (username) user.username = username;
    if (newPassword) user.password = newPassword;
    await user.save();

    req.session.user.username = username;
    req.flash('success', 'Profile updated successfully');
    res.redirect('/prof');
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('/prof');
  }
});

router.get('/orders', isLoggedIn, orderController().index);

router.post('/orders', isLoggedIn, orderController().store);

router.post('/updateCart', cartController().update);

router.get('/adminOrders', isAdminLoggedIn, adminOrdersController().index);

router.get('/singleOrder/:id', isLoggedIn, orderController().show);

router.post('/status', isAdminLoggedIn, statusController().update);

router.post('/adminReg', async (req, res) => {
  try {
    const existingAdmin = await adminReg.findOne({
      username: req.body.username,
    });
    if (existingAdmin) {
      req.flash('error', 'Admin already exists');
      return res.status(400).redirect('/adminReg');
    }

    const registerAdmin = new adminReg(req.body);
    await registerAdmin.save();
    req.flash('success', 'Admin registered successfully. Please log in.');
    res.status(200).redirect('/adminLogin');
  } catch (error) {
    req.flash('error', error.message);
    res.status(500).redirect('/adminReg');
  }
});

router.post('/adminLogin', async (req, res) => {
  try {
    const { username, ID, password } = req.body;
    const admin = await adminReg.findOne({ username, ID });
    if (!admin || admin.password !== password) {
      req.flash('error', 'Invalid credentials');
      return res.redirect('/adminLogin');
    }

    req.session.admin = { _id: admin._id, username: admin.username };
    req.flash('success', 'Admin login successful!');
    res.redirect('/admin');
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('/adminLogin');
  }
});

// Logout Routes
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send(err);
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});

router.get('/adminLogout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send(err);
    res.clearCookie('connect.sid');
    res.redirect('/adminLogin');
  });
});

module.exports = router;
