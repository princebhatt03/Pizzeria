const mongoose = require('../db/db');

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  age: Number,
});

module.exports = mongoose.model('User', userSchema);
