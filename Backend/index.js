const express = require('express');
const mongoose = require('mongoose');
const contentful = require('contentful');
const cors = require('cors');
require('dotenv').config();

const Post = require('./models/Post');

const app = express();
const PORT = process.env.PORT || 5000;

// --- CONFIGURATION ---
const CONTENT_TYPE_ID = 'FirstPage'; // Centralized so you only change it in one place

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION ---
// We use a variable for options to keep the connection line clean
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB: Connected Successfully"))
  .catch(err => console.error("❌ MongoDB: Connection Error ->", err.message));

// --- CONTENTFUL CLIENT ---
const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

// --- ROUTES ---

/**
 * GET /api/posts
 * Fetches entries from Contentful and merges them with like-counts from MongoDB
 */
app.get('/api/posts', async (req, res) => {
  try {
    // Parallel fetching: we start both requests at once for better speed
    const [contentfulRes, mongoPosts] = await Promise.all([
      client.getEntries({ content_type: CONTENT_TYPE_ID }),
      Post.find()
    ]);

    // Merge Contentful data with MongoDB like counts
    const mergedData = contentfulRes.items.map(item => {
      const mongoRecord = mongoPosts.find(m => m.contentfulId === item.sys.id);
      return {
        ...item,
        likes: mongoRecord ? mongoRecord.likes : 0
      };
    });

    res.json(mergedData);
  } catch (err) {
    console.error("❌ Fetch Error:", err.message);
    res.status(500).json({ error: "Failed to sync data from CMS and Database" });
  }
});

/**
 * POST /api/posts/:id/like
 * Increments the like count for a specific Contentful entry in MongoDB
 */
app.post('/api/posts/:id/like', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedPost = await Post.findOneAndUpdate(
      { contentfulId: id },
      { $inc: { likes: 1 } },
      { new: true, upsert: true } // upsert: true creates the doc if it doesn't exist
    );
    res.json(updatedPost);
  } catch (err) {
    console.error("❌ Like Error:", err.message);
    res.status(500).json({ error: "Could not register like" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server active at http://localhost:${PORT}`);
});