import mongoose from "mongoose";
import ENV from "./env.js";


const connectDb = async () => {
  try{
    await mongoose.connect(ENV.DB_URL);
    console.log("Connected to database successfully");
  } catch(error) {
    console.log("Error connecting to database", error);
  }
}

export default connectDb;