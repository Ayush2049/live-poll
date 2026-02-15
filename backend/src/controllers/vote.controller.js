import { castVoteService } from "../services/vote.service.js";
import { io } from "../server.js";

export const castVote = async (req, res, next) => {
  try {
    const { pollId } = req.params;
    const { optionId, deviceToken } = req.body;

    if (!optionId || !deviceToken) {
      return res.status(400).json({
        success: false,
        message: "Option ID and device token are required.",
      });
    }

    const updatedPoll = await castVoteService({
      pollId,
      optionId,
      deviceToken,
    });

    io.to(pollId).emit("vote_update", updatedPoll);

    res.status(200).json({
      success: true,
      message: "Vote recorded successfully.",
      data: updatedPoll,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(403).json({
        success: false,
        message: "You have already voted in this poll.",
      });
    }

    next(error);
  }
};
