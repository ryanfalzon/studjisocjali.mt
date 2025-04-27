import { Router } from "express";

const router = Router();

const API_KEY = process.env.GOOGLE_API_KEY;
const PLACE_ID = process.env.GOOGLE_PLACE_ID;

let cache = { timestamp: 0, data: null };
const CACHE_TTL = process.env.CACHE_TTL;

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Retrieve last 5 Google Place reviews, newest first
 *     tags:
 *       - Reviews
 *     responses:
 *       200:
 *         description: Reviews fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: Place name
 *                 rating:
 *                   type: number
 *                   description: Place overall rating
 *                 reviews:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       author_name:
 *                         type: string
 *                       rating:
 *                         type: number
 *                       time:
 *                         type: integer
 *                       text:
 *                         type: string
 *       500:
 *         description: Error fetching reviews
 */
router.get("/", async (req, res) => {
  try {
    if (cache.data && Date.now() - cache.timestamp < CACHE_TTL) {
      return res.status(200).json(cache.data);
    }

    const url = new URL(
      "https://maps.googleapis.com/maps/api/place/details/json"
    );
    url.searchParams.set("place_id", PLACE_ID);
    url.searchParams.set("fields", "name,rating,reviews");
    url.searchParams.set("key", API_KEY);

    const response = await fetch(url.toString());
    const json = await response.json();

    if (json.error_message) {
      return res.status(500).json({ error: json.error_message });
    }

    const allReviews = Array.isArray(json.result.reviews)
      ? json.result.reviews
      : [];
    const sorted = allReviews.sort((a, b) => b.time - a.time);
    const latestFive = sorted.slice(0, 4);

    const result = {
      name: json.result.name,
      rating: json.result.rating,
      reviews: latestFive,
    };

    cache = { timestamp: Date.now(), data: result };
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch Google reviews",
      error: error.message,
    });
  }
});

export default router;
