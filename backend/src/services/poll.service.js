import { Poll } from "../models/poll.model.js";

/**
 * Create new poll
 */
export const createPollService = async (data) => {
  const formattedOptions = data.options.map((text) => ({ text }));

  const poll = await Poll.create({
    question: data.question,
    options: formattedOptions,
    expiresAt: data.expiresAt,
  });

  return poll;
};

/**
 * Get poll by ID
 */
export const getPollByIdService = async (pollId) => {
  const poll = await Poll.findById(pollId).lean();

  if (!poll) {
    throw new Error("Poll not found.");
  }

  // Dynamically update active state
  if (new Date() > poll.expiresAt) {
    poll.isActive = false;
  }

  return poll;
};

/**
 * Get all polls (latest first)
 */
export const getAllPollsService = async () => {
  const polls = await Poll.find()
    .sort({ createdAt: -1 })
    .select("question totalVotes expiresAt createdAt");

  return polls;
};

/**
 * Get only active polls (optional enhancement)
 */
export const getActivePollsService = async () => {
  const polls = await Poll.find({
    expiresAt: { $gt: new Date() },
  })
    .sort({ createdAt: -1 })
    .select("question totalVotes expiresAt createdAt");

  return polls;
};
