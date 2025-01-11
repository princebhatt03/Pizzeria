var express = require('express');
var router = express.Router();
const userReg = require('../models/users');
const adminReg = require('../models/admin');
const homeController = require('../controllers/home.controller');
const adminHomeController = require('../controllers/adminHome.controller');
const session = require('express-session');
const flash = require('connect-flash');

router.use(
  session({
    secret: 'SECRET',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 3600000 },
  })
);

router.use(flash());

function isLoggedIn(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
}

function isAdminLoggedIn(req, res, next) {
  if (req.session.admin) {
    return next();
  }
  res.redirect('/adminLogin');
}

// User's Get Routes

router.get('/', homeController().index);

router.get('/cart', isLoggedIn, function (req, res, next) {
  res.render('customer/cart');
});

router.get('/prof', isLoggedIn, (req, res) => {
  const success = req.flash('success');
  const error = req.flash('error');
  const { username } = req.session.user;

  res.render('profile', {
    success,
    error,
    user: username,
  });
});

router.get('/login', function (req, res, next) {
  const success = req.flash('success');
  const error = req.flash('error');
  res.render('auth/login', { success, error });
});

router.get('/reg', function (req, res, next) {
  const success = req.flash('success');
  const error = req.flash('error');
  res.render('auth/register', { success, error });
});

// Admin's Get Routes

router.get('/admin', isAdminLoggedIn, adminHomeController().index);

router.get('/adminLogin', function (req, res, next) {
  const success = req.flash('success');
  const error = req.flash('error');
  res.render('auth/adminLogin', { success, error });
});

router.get('/adminReg', function (req, res, next) {
  const success = req.flash('success');
  const error = req.flash('error');
  res.render('auth/adminReg', { success, error });
});

router.get('/adminProf', isAdminLoggedIn, (req, res) => {
  const success = req.flash('success');
  const error = req.flash('error');
  const { username, ID } = req.session.admin;
  res.render('adminProfile', { success, error, admin: { username, ID } });
});

// User's Post Routes

router.post('/reg', async function (req, res, next) {
  try {
    const existingUser = await userReg.findOne({
      username: req.body.username,
    });
    if (existingUser) {
      return res.status(400).send('Username Already Exist');
    }
    const registerUser = new userReg({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    await registerUser.save();
    req.flash('success', 'User registered successful, Now Login to continue');
    res.status(201).redirect('/login');
  } catch (error) {
    req.flash('error', error.message);
    res.status(400).send(error.message);
  }
});

router.post('/login', async function (req, res) {
  try {
    const { username, password } = req.body;
    const user = await userReg.findOne({ username: username });
    if (!user || user.password !== password) {
      req.flash('error', 'Username or Password is Incorrect');
      return res.redirect('/login');
    }
    req.session.user = { id: user._id, username: user.username };
    req.flash('success', 'Login successful!');
    res.status(200).redirect('/');
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('/login');
  }
});

router.post('/prof', isLoggedIn, async (req, res) => {
  try {
    const { username, currentPassword, newPassword, confirmPassword } =
      req.body;

    const userId = req.session.user.id;
    const user = await userReg.findById(userId);

    if (!user) {
      req.flash('error', 'User not found.');
      return res.redirect('/');
    }
    if (currentPassword && user.password !== currentPassword) {
      req.flash('error', 'Current password is incorrect.');
      return res.redirect('/');
    }

    const existingUsername = await userReg.findOne({
      username,
      _id: { $ne: userId },
    });
    if (existingUsername) {
      req.flash('error', 'Username already exists. Please choose another one.');
      return res.redirect('/');
    }

    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        req.flash('error', 'New password and confirm password do not match.');
        return res.redirect('/');
      }
      user.password = newPassword;
    }

    user.username = username;
    await user.save();

    req.session.user.username = username;
    req.flash('success', 'Profile updated successfully!');
    res.redirect('/');
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('/');
  }
});

// Admin's Post Routes

router.post('/adminReg', async function (req, res) {
  try {
    const existingAdmin = await adminReg.findOne({
      username: req.body.username,
    });
    if (existingAdmin) {
      req.flash('error', 'Admin Already Exists');
      return res.status(400).send('Admin Already Exists');
    }

    const registerAdmin = new adminReg({
      username: req.body.username,
      ID: req.body.ID,
      email: req.body.email,
      password: req.body.password,
    });
    await registerAdmin.save();
    req.flash(
      'success',
      'Admin registered successfully, Now login to continue'
    );
    res.status(200).redirect('/adminLogin');
  } catch (error) {
    req.flash('error', error.message);
    res.status(400).send(error.message);
  }
});

router.post('/adminLogin', async (req, res) => {
  try {
    const { username, ID, password } = req.body;
    const admin = await adminReg.findOne({ username, ID });
    if (!admin || admin.password !== password) {
      req.flash('error', 'Username, Password, or ID Incorrect');
      return res.redirect('/adminLogin');
    }
    req.session.admin = { id: admin._id, username: admin.username };
    req.flash('success', 'Admin login successful!');
    res.status(201).redirect('/admin');
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('/adminLogin');
  }
});

router.post('/adminProf', isAdminLoggedIn, async (req, res) => {
  try {
    const { username, ID, currentPassword, newPassword, confirmPassword } =
      req.body;

    const adminId = req.session.admin.id;
    const admin = await adminReg.findById(adminId);

    if (!admin) {
      req.flash('error', 'Admin not found.');
      return res.redirect('/admin');
    }
    if (currentPassword && admin.password !== currentPassword) {
      req.flash('error', 'Current password is incorrect.');
      return res.redirect('/admin');
    }
    const existingUsername = await adminReg.findOne({
      username,
      _id: { $ne: adminId },
    });
    if (existingUsername) {
      req.flash('error', 'Username already exists. Please choose another one.');
      return res.redirect('/admin');
    }
    const existingID = await adminReg.findOne({
      ID,
      _id: { $ne: adminId },
    });
    if (existingID) {
      req.flash('error', 'Admin ID already exists. Please choose another one.');
      return res.redirect('/admin');
    }
    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        req.flash('error', 'New password and confirm password do not match.');
        return res.redirect('/admin');
      }
      admin.password = newPassword;
    }
    admin.username = username;
    admin.ID = ID;
    await admin.save();
    req.session.admin.username = username;
    req.flash('success', 'Profile updated successfully!');
    res.redirect('/admin');
  } catch (error) {
    console.error('Error updating admin profile:', error.message);
    req.flash(
      'error',
      'An error occurred while updating the profile. Please try again.'
    );
    res.redirect('/admin');
  }
});

// User Logout
router.get('/logout', function (req, res, next) {
  const success = req.flash('success');
  const error = req.flash('error');
  req.session.destroy(err => {
    if (err) {
      return next(err);
    }
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});

// Admin Logout
router.get('/adminLogout', function (req, res, next) {
  const success = req.flash('success');
  const error = req.flash('error');
  req.session.destroy(err => {
    if (err) {
      return next(err);
    }
    res.clearCookie('connect.sid');
    res.redirect('/adminLogin');
  });
});

module.exports = router;
