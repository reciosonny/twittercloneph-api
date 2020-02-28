const mongoose = require('mongoose');
const { Schema } = mongoose;

const tweetSchema = new Schema({
  username: String,
  tweet: String,
  usernamesLiked: [String]
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

mongoose.model('tweet', tweetSchema);