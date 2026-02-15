import { castVoteService } from "../services/vote.service.js";
import { generateVoterToken } from "../utils/generateToken.js";
import { io } from "../server.js";

export const castVote = async (req, res, next) => {
  try {
    const { pollId } = req.params;
    const { optionId } = req.body;

    if (!optionId) {
      throw new Error("Option ID is required.");
    }

    let voterToken = req.cookies?.voterToken;

    if (!voterToken) {
      voterToken = generateVoterToken();
      res.cookie("voterToken", voterToken, {
        httpOnly: true,
        sameSite: "strict",
      });
    }

    const updatedPoll = await castVoteService({
      pollId,
      optionId,
      voterToken,
      voterIP: req.ip,
    });

    // 🔥 Broadcast to room - only users in this poll receive update
    io.to(pollId).emit("vote_update", updatedPoll);

    res.status(200).json({
      success: true,
      message: "Vote recorded successfully.",
      data: updatedPoll,
    });
  } catch (error) {
    next(error);
  }
};