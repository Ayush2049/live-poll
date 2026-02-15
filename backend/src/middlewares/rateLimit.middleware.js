import rateLimit from "express-rate-limit";

export const voteRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many vote attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
