import { Vote } from "../models/vote.model.js";

export const checkDuplicateVote = async (req, res, next) => {
  try {
    const { pollId } = req.params;
    const voterToken = req.cookies?.voterToken;
    const voterIP = req.ip;

    const existingVote = await Vote.findOne({
      pollId,
      $or: [{ voterToken }, { voterIP }],
    });

    if (existingVote) {
      return res.status(403).json({
        success: false,
        message: "You have already voted in this poll.",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};
