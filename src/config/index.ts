import dotenv from "dotenv";
dotenv.config();

const config = {
  get nodeEnv() {
    return process.env.NODE_ENV;
  },
  get devEnv() {
    return process.env.DEV_ENV;
  },
  get port() {
    return process.env.PORT || 5000;
  },
  get mongoUri() {
    return process.env.MONGO_URI;
  },
  get jwtSecret() {
    return process.env.JWT_SECRET;
  },
};

export default config;
