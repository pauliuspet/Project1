const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  contentfulId: { type: String, required: true, unique: true },
  likes: { type: Number, default: 0 }
});

module.exports = mongoose.model('Post', PostSchema);