const express = require('express');
const contentful = require('contentful');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

// Initialize Contentful Client
const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

// Create a route to get data
app.get('/api/posts', async (req, res) => {
  try {
    const entries = await client.getEntries();
    res.json(entries.items);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error fetching Contentful data");
  }
});

// Route to "Like" a post
app.post('/api/posts/:id/like', async (req, res) => {
  const { id } = req.params;
  try {
    // Find the post by Contentful ID and increment likes by 1
    // "upsert: true" means: if it doesn't exist in MongoDB yet, create it!
    const post = await Post.findOneAndUpdate(
      { contentfulId: id },
      { $inc: { likes: 1 } },
      { new: true, upsert: true }
    );
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Failed to like post" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 API running at http://localhost:${PORT}/api/posts`));

const mongoose = require('mongoose');

const Post = require('./models/Post')

// Add this below your other imports
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🔌 Connected to MongoDB Cloud"))
  .catch(err => console.error("Could not connect to MongoDB", err));
  