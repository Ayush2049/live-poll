import express from "express";
import mongoose from "mongoose";
import { castVote } from "../controllers/vote.controller.js";
import { voteRateLimiter } from "../middlewares/rateLimit.middleware.js";

const router = express.Router();

/**
 * Validate pollId format before hitting controller
 */
const validatePollId = (req, res, next) => {
  const { pollId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(pollId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid poll ID format.",
    });
  }

  next();
};

/**
 * Cast Vote Route
 *
 * Middleware Order:
 * 1. Rate limiting
 * 2. Validate pollId
 * 3. Cast vote controller
 */
router.post(
  "/:pollId",
  voteRateLimiter,
  validatePollId,
  castVote
);


export default router;
