const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());

//#region Initialize mongoose models

require("./models/Tweet");

//#endregion


// #region mongoose configuration
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://reciosonny:abcd1234@ds121262.mlab.com:21262/twitter-clone-bootcamp-gensan");
// #endregion

const middlewares = [bodyParser.urlencoded(), bodyParser.json()];
app.use(middlewares);

const Tweet = mongoose.model('tweet');

app.get("/api/test", (req, res) => {

  res.send("response");
});

app.get("/api/tweets", async (req, res) => {

  const data = await Tweet.find({});
  const finalData = data.map(x => {

    return {
      id: x._id,
      tweet: x.tweet,
      username: x.username,
      numLikes: x.usernamesLiked.length
    }
  });

  res.send(finalData);
});

app.post("/api/tweets", async (req, res) => {

  try {
    const { username, tweet } = req.body;
  
    const tweetData = new Tweet({
      username,
      tweet,
      usernamesLiked: ["user1", "user2", "user3"]
    });
  
    const newTweet = await tweetData.save();
    res.send(newTweet);


  } catch (error) {
    throw error;
  }

});

app.put("/api/tweets/toggletweetlike", async (req, res) => {

  try {
    const { username, id } = req.body;

    const tweetUsernameLiked = await Tweet.findOne({ _id: id, usernamesLiked: username });

    if (tweetUsernameLiked) { //if username liked the tweet, remove username to unlike the tweet
      // res.send("exist");
      const newUsernamesLiked = tweetUsernameLiked.usernamesLiked.filter(tweetUsername => tweetUsername !== username);

      await Tweet.updateOne({ _id: id }, { usernamesLiked: newUsernamesLiked });


      const result = await Tweet.findOne({ _id: id });
      res.send(result);
    } else { //if username haven't liked the tweet yet, add username to like the tweet

      const tweetToLike = await Tweet.findOne({ _id: id });
      const newUsernamesLiked = tweetToLike.usernamesLiked.concat([username]);

      await Tweet.updateOne({ _id: id }, { usernamesLiked: newUsernamesLiked });


      const result = await Tweet.findOne({ _id: id });
      res.send(result);
    }

  } catch (error) {
    throw error;
  }

});


app.delete("/api/tweets/:id", async (req, res) => {

  const { id } = req.params;

  try {
    const result = await Tweet.deleteOne({ _id: id });
    const count = result.deletedCount;

    res.send(count.toString());

  } catch (error) {
    
    debugger;
    res.status(500).send(error);

  }

  
});

app.get("/", (req, res) => {

  res.send("Twitter App API")
});


const PORT = process.env.PORT || 5000;
app.listen(PORT);