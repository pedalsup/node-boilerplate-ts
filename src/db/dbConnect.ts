import mongoose from "mongoose";
import config from "@/config";

const dbConnect = (callback = () => {}) => {
  mongoose
    .connect(config.mongoUri as string)
    .then(() => {
      console.log("Connected to Database");
      callback();
    })
    .catch((err) => {
      console.error(`Failed to connect to MongoDB: ${err.message}`);
    });
};

export default dbConnect;
