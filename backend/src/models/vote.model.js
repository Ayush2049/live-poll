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
    deviceToken: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// 🔥 ONE DEVICE PER POLL
voteSchema.index({ pollId: 1, deviceToken: 1 }, { unique: true });

export const Vote = mongoose.model("Vote", voteSchema);
