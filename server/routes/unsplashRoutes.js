import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { isLoggedIn } from "../middleware/auth.js";
import SearchHistory from "../models/SearchHistory.js";

dotenv.config();
const router = express.Router();

router.get("/search",isLoggedIn, async (req, res) => {
  const query = req.query.q; 
  if (!query) return res.status(400).json({ message: "Query is required" });

  try {
    const response = await axios.get("https://api.unsplash.com/search/photos", {
      params: { query, per_page: 50 },
      headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` }
    });

    await SearchHistory.create({
      userId: req.user._id,   
      term: query,
      timestamp: new Date(),
    });

    res.json(response.data.results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unsplash API error" });
  }
});

router.get("/history", isLoggedIn, async (req, res) => {
  const history = await SearchHistory.find({ userId: req.user._id }).sort({ timestamp: -1 });
  res.json(history);
});


router.get("/top-searches", async (req, res) => {
  try {
    const topTerms = await SearchHistory.aggregate([
      {
        $group: {
          _id: "$term",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json(topTerms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching top searches" });
  }
});


export default router;
