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
    existingVote: null,
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

  // 🔎 Check duplicate manually
  const existingVote = await Vote.findOne({
    pollId,
    deviceToken,
  });

  debug.existingVote = existingVote;

  if (existingVote) {
    debug.status = "Duplicate vote detected";
    return { debug };
  }

  await Vote.create({
    pollId,
    optionId,
    deviceToken,
  });

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

  debug.status = "Vote successful";

  return {
    poll: updatedPoll,
    debug,
  };
};
