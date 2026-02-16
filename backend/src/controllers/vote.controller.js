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

    const result = await castVoteService({
      pollId,
      optionId,
      deviceToken,
      voterIP: req.ip, // 🔥 important
    });

    if (!result.poll) {
      return res.status(200).json({
        success: false,
        message: result.debug.action,
        debug: result.debug,
      });
    }

    io.to(pollId).emit("vote_update", result.poll);

    return res.status(200).json({
      success: true,
      message: "Vote recorded successfully.",
      data: result.poll,
      debug: result.debug,
    });
  } catch (error) {
    next(error);
  }
};
