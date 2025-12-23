import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
  try {
    if (!ENV.DB_URL) {
        console.log("ENV object:", ENV);
console.log("process.env.DB_URL:", process.env.DB_URL);

      console.error("Error: DB_URL is not defined in environment variables!");
      process.exit(1);
    }
    console.log("MONGO_URI =", ENV.DB_URL);

    const conn = await mongoose.connect(ENV.DB_URL);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("some error occured in connecting to the database", err);
  }
};
