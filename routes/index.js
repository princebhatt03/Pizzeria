var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/cart', function (req, res, next) {
  res.render('customer/cart');
});

router.get('/login', function (req, res, next) {
  res.render('auth/login');
});

router.get('/reg', function (req, res, next) {
  res.render('auth/register');
});

module.exports = router;
