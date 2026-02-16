import { Poll } from "../models/poll.model.js";
import { Vote } from "../models/vote.model.js";

export const castVoteService = async ({
  pollId,
  optionId,
  deviceToken,
}) => {
  const debug = {
    pollId,
    optionId,
    deviceToken,
    status: "",
  };

  const poll = await Poll.findById(pollId);

  if (!poll) {
    debug.status = "Poll not found";
    return { debug };
  }

  if (new Date() > poll.expiresAt) {
    debug.status = "Poll expired";
    return { debug };
  }

  const option = poll.options.id(optionId);

  if (!option) {
    debug.status = "Invalid option";
    return { debug };
  }

  try {
    // 🔥 THIS IS THE KEY
    await Vote.create({
      pollId,
      optionId,
      deviceToken,
    });
  } catch (error) {
    // 🔥 DUPLICATE BLOCKED BY MONGODB
    if (error.code === 11000) {
      debug.status = "Duplicate vote blocked by unique index";
      return { debug };
    }
    throw error;
  }

  // Increment only if vote inserted
  await Poll.updateOne(
    { _id: pollId, "options._id": optionId },
    {
      $inc: {
        "options.$.voteCount": 1,
        totalVotes: 1,
      },
    }
  );

  const updatedPoll = await Poll.findById(pollId);

  debug.status = "Vote inserted successfully";

  return {
    poll: updatedPoll,
    debug,
  };
};
