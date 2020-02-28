const mongoose = require('mongoose');
const { Schema } = mongoose;

const tweetSchema = new Schema({
  username: String,
  tweet: String,
  usernamesLiked: [String]
});

mongoose.model('tweet', tweetSchema);