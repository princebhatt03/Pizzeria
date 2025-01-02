var express = require('express');
var router = express.Router();
const homeController = require('../controllers/home.controller');

router.get('/', homeController().index);

router.get('/cart', function (req, res, next) {
  res.render('customer/cart');
});

router.get('/login', function (req, res, next) {
  res.render('auth/login');
});

router.get('/reg', function (req, res, next) {
  res.render('auth/register');
});

// Post Routes...

router.post('/reg', function (req, res, next) {
  // controllers
});

module.exports = router;
