const mongoose = require('mongoose');

const platformSchema = new mongoose.Schema({
  name: String,
  slug: String,
  games_count: Number,
  thumbUp: { type: Number, default: 0 },
  thumbDown: { type: Number, default: 0 }
});

module.exports = mongoose.model('Platform', platformSchema);