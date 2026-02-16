import { castVoteService } from "../services/vote.service.js";
import { io } from "../server.js";

export const castVote = async (req, res, next) => {
  try {
    const { pollId } = req.params;
    const { optionId, deviceToken } = req.body;

    // 🛑 Basic validation
    if (!optionId || !deviceToken) {
      return res.status(400).json({
        success: false,
        message: "Option ID and device token are required.",
        debug: {
          pollId,
          optionId,
          deviceToken,
          reason: "Missing required fields",
        },
      });
    }

    // 🔥 Call service
    const result = await castVoteService({
      pollId,
      optionId,
      deviceToken,
    });

    // 🔎 If service returns debug only (duplicate or error case)
    if (!result.poll) {
      return res.status(200).json({
        success: false,
        message: result.debug?.status || "Vote failed",
        debug: result.debug,
      });
    }

    // 📡 Emit real-time update
    io.to(pollId).emit("vote_update", result.poll);

    return res.status(200).json({
      success: true,
      message: "Vote recorded successfully.",
      data: result.poll,
      debug: result.debug,
    });
  } catch (error) {
    // 🔥 Mongo duplicate index error (just in case)
    if (error.code === 11000) {
      return res.status(403).json({
        success: false,
        message: "You have already voted in this poll.",
        debug: {
          mongoError: "Duplicate index triggered",
        },
      });
    }

    next(error);
  }
};
