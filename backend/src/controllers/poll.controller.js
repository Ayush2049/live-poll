import mongoose from "mongoose";
import {
  createPollService,
  getPollByIdService,
  getAllPollsService,
} from "../services/poll.service.js";
import { validateCreatePoll } from "../validators/poll.validator.js";
import { env } from "../config/env.config.js";

/**
 * Create Poll
 */
export const createPoll = async (req, res, next) => {
  try {
    const validatedData = validateCreatePoll(req.body);

    const poll = await createPollService(validatedData);

    const shareUrl = `${env.clientUrl}/poll/${poll._id}`;

    res.status(201).json({
      success: true,
      data: {
        pollId: poll._id,
        shareUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Single Poll
 */
export const getPoll = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid poll ID format.");
    }

    const poll = await getPollByIdService(id);

    res.status(200).json({
      success: true,
      data: poll,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get All Polls
 */
export const getAllPolls = async (req, res, next) => {
  try {
    const polls = await getAllPollsService();

    res.status(200).json({
      success: true,
      data: polls,
    });
  } catch (error) {
    next(error);
  }
};
