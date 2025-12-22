import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async() => {
    try{
        const conn = await mongoose.connect(ENV.DB_URL);
        console.log("Connected to MongoDB");
    } catch(err){
        console.error("some error occured in connecting to the database");   
    }
} 