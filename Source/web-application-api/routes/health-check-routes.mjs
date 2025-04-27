import { Router } from "express";

const router = Router();

/**
 * @swagger
 * /health/ping:
 *   get:
 *     summary: Check if the service is running
 *     tags:
 *      - Service
 *     responses:
 *       200:
 *         description: Service is up and running
 */
router.get("/ping", (req, res) => {
  res.status(200).json({ status: "Service is up and running!" });
});

export default router;
