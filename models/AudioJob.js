const mongoose = require('mongoose');

const AudioJobSchema = new mongoose.Schema({
  userId: String,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AudioJob', AudioJobSchema);
