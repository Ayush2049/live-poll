import mongoose from "mongoose";

const optionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    voteCount: {
      type: Number,
      default: 0,
    },
  },
  { _id: true }
);

const pollSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [optionSchema],
      validate: [(val) => val.length >= 2, "Minimum 2 options required"],
    },
    totalVotes: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

pollSchema.index({ expiresAt: 1 });

export const Poll = mongoose.model("Poll", pollSchema);
