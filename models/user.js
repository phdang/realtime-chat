const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
  name: { type: String, required: true, min: [50, 'Name is too long'] },
  img: { type: String, default: 'noImage.jpg' },
  timestamp: { type: Date, default: Date.now }
});
module.exports = mongoose.model('User', userSchema);
