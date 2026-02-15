import express from "express";
import {
  createPoll,
  getPoll,
  getAllPolls,
} from "../controllers/poll.controller.js";

const router = express.Router();

// Create poll
router.post("/", createPoll);

// Get all polls
router.get("/", getAllPolls);

// Get single poll
router.get("/:id", getPoll);

export default router;
