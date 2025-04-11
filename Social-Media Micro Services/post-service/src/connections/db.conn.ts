import mongoose from "mongoose";
import asyncRetry from "async-retry";
import PostModel from "../models/Post.model";
import { EnvConfig } from "../conf/env_config";
import AppError from "../utils/app_error";
import { Responces } from "../utils/responses";

// mongoose.set("strictQuery", false) // remove this in production
async function connectToDatabase() {
  try {
    await asyncRetry(
      async () => {
        await mongoose.connect(EnvConfig.DATABASE_URI as string, {
          dbName: "ms_postservice",
          connectTimeoutMS: 30000,
          serverSelectionTimeoutMS: 100000,
          socketTimeoutMS: 45000,
          autoIndex: false,
        });
      },
      {
        maxRetryTime: 60000, // Give up after retrying the function for 60 seconds
        retries: 4, // Set a maximum number of retries
        // delay: (attemptNumber: any) => Math.pow(2, attemptNumber) * 1000,
        onRetry: (error: any, attemptNumber: number) => {
          console.info(
            `Database connection failed: attempt ${attemptNumber}, error: ${error.message}, Retrying database connection...`
          );
        },
      }
    );
    console.info(
      `Connection to DB is successfull host is: ${mongoose.connection.host}`
    );

    // 💥💥💥 INDEX CREATION FOR ALL MODELS 💥💥💥
    // 1. Create the index on the post collection
    await PostModel.createIndexes();

    console.info("Indexes are Created! 🚀");
  } catch (error: any) {
    console.error(error.message, "Failed to connect to database.");
    throw new AppError({
      message: error.message as string,
      status: Responces.BAD_REQUEST,
    });
  }
}

export default connectToDatabase;
