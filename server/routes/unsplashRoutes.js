import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.get("/search", async (req, res) => {
  const query = req.query.q; // search term from frontend
  if (!query) return res.status(400).json({ message: "Query is required" });

  try {
    const response = await axios.get("https://api.unsplash.com/search/photos", {
      params: { query, per_page: 50 },
      headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` }
    });

    res.json(response.data.results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unsplash API error" });
  }
});

export default router;
