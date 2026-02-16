import { Poll } from "../models/poll.model.js";
import { Vote } from "../models/vote.model.js";

export const castVoteService = async ({
  pollId,
  optionId,
  deviceToken,
  voterIP,
}) => {
  const debug = {
    pollId,
    optionId,
    deviceToken,
    voterIP,
    action: "",
  };

  const poll = await Poll.findById(pollId);

  if (!poll) {
    debug.action = "Poll not found";
    return { debug };
  }

  if (new Date() > poll.expiresAt) {
    debug.action = "Poll expired";
    return { debug };
  }

  const option = poll.options.id(optionId);

  if (!option) {
    debug.action = "Invalid option";
    return { debug };
  }

  // 🛡 STEP 1 — IP Throttle (5 votes per 10 minutes per poll)
  const recentVotesFromIP = await Vote.countDocuments({
    pollId,
    voterIP,
    createdAt: {
      $gte: new Date(Date.now() - 10 * 60 * 1000),
    },
  });

  if (recentVotesFromIP >= 5) {
    debug.action = "IP throttle triggered";
    return { debug };
  }

  // 🛡 STEP 2 — Hard duplicate check (unique index safety)
  const existingVote = await Vote.findOne({
    pollId,
    deviceToken,
  });

  if (existingVote) {
    debug.action = "Duplicate vote blocked";
    return { debug };
  }

  // 🛡 STEP 3 — Create vote
  await Vote.create({
    pollId,
    optionId,
    deviceToken,
    voterIP,
  });

  // 🛡 STEP 4 — Atomic increment
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

  debug.action = "Vote successful";

  return {
    poll: updatedPoll,
    debug,
  };
};
