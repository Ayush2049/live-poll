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

  // 🔥 STEP 1 — Remove accidental duplicates (if any exist)
  const existingVotes = await Vote.find({
    pollId,
    deviceToken,
  });

  if (existingVotes.length > 1) {
    // Keep first, delete rest
    const [, ...remove] = existingVotes;

    await Vote.deleteMany({
      _id: { $in: remove.map(v => v._id) },
    });

    debug.action = "Cleaned old duplicate votes";
  }

  // 🔥 STEP 2 — Check if vote already exists
  const alreadyVoted = await Vote.findOne({
    pollId,
    deviceToken,
  });

  if (alreadyVoted) {
    debug.action = "Duplicate vote blocked";
    return { debug };
  }

  // 🔥 STEP 3 — Create vote
  await Vote.create({
    pollId,
    optionId,
    deviceToken,
  });

  // 🔥 STEP 4 — Increment poll counts
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
