import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
  {
    pollId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Poll",
      required: true,
      index: true,
    },
    optionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    voterToken: {
      type: String,
      required: true,
      index: true,
    },
    voterIP: {
      type: String,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate token vote per poll
voteSchema.index({ pollId: 1, voterToken: 1 }, { unique: true });

// Prevent duplicate IP vote per poll
voteSchema.index({ pollId: 1, voterIP: 1 }, { unique: true });

export const Vote = mongoose.model("Vote", voteSchema);
