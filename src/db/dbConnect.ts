import mongoose from "mongoose";
import CONFIG from "../utils/config";

const dbConnect = (callback = () => {}) => {
  mongoose
    .connect(CONFIG.mongoUri as string)
    .then(() => {
      console.log("Connected to Database...");
      callback();
    })
    .catch((err) => {
      console.error(`Failed to connect to MongoDB: ${err.message}`);
    });
};

export default dbConnect;
