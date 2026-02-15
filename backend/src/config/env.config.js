import dotenv from "dotenv";

dotenv.config();

const requiredEnv = ["PORT", "MONGO_URI", "CLIENT_URL"];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

export const env = {
  port: process.env.PORT,
  mongoUri: process.env.MONGO_URI,
  clientUrl: process.env.CLIENT_URL,
};
