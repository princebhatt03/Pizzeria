const mongoose = require('mongoose');
require('dotenv').config();

const mongoUri = process.env.DATABASE_CONNECTION_STRING;

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('Connected to database');
  })
  .catch(err => {
    console.log('Error connecting to database', err);
  });

module.exports = mongoose;
