import { Poll } from "../models/poll.model.js";
import { Vote } from "../models/vote.model.js";

export const castVoteService = async ({
  pollId,
  optionId,
  voterToken,
  voterIP,
}) => {
  const poll = await Poll.findById(pollId);

  if (!poll) {
    throw new Error("Poll not found.");
  }

  if (new Date() > poll.expiresAt) {
    throw new Error("Poll has expired.");
  }

  const option = poll.options.id(optionId);

  if (!option) {
    throw new Error("Invalid option selected.");
  }

  // Create vote (unique index will prevent duplicates)
  await Vote.create({
    pollId,
    optionId,
    voterToken,
    voterIP,
  });

  // Atomic increment using updateOne
  await Poll.updateOne(
    { _id: pollId, "options._id": optionId },
    {
      $inc: {
        "options.$.voteCount": 1,
        totalVotes: 1,
      },
    }
  );

  return await Poll.findById(pollId);
};
