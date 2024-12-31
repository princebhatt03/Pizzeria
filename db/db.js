const mongoose = require('mongoose');

mongoose
  .connect('mongodb://0.0.0.0/Pizza_DATABASE')
  .then(() => {
    console.log('Connected to database');
  })
  .catch(err => {
    console.log('Error connecting to database', err);
  });

module.exports = mongoose;
