var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/cart', function (req, res, next) {
  res.render('customer/cart');
});

module.exports = router;
