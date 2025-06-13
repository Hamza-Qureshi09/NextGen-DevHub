import mongoose from 'mongoose';
import asyncRetry from 'async-retry';
import { EnvConfig } from '../config/env.config';
import AppError from '../utils/app_errors';
import { Responces } from '../utils/responses';

// mongoose.set("strictQuery", false) // remove this in production
async function connectToDatabase() {
  try {
    await asyncRetry(
      async () => {
        await mongoose.connect(EnvConfig.DATABASE_URI as string, {
          dbName: 'access-system',
          connectTimeoutMS: 120000,
          serverSelectionTimeoutMS: 100000,
          socketTimeoutMS: 120000,
          autoIndex: false,
          minPoolSize: 10,
        });
      },
      {
        maxRetryTime: 60000, // Give up after retrying the function for 60 seconds
        retries: 5, // Set a maximum number of retries
        onRetry: (error: any, attemptNumber: number) => {
          console.info(
            `Database connection failed: attempt ${attemptNumber}, error: ${error.message}, Retrying database connection...`
          );
        },
      }
    );
    console.info(`Connection to DB is successfull host is: ${mongoose.connection.host}`);

    // 💥💥💥 INDEX CREATION FOR ALL MODELS 💥💥💥
    // 1. Create the index on the session collection
    // await RefreshToken.collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0, background: true });
    console.info('Indexes are Created! 🚀');

    return mongoose.connection;
  } catch (error: any) {
    console.error(error.message, 'Failed to connect to database.');
    throw new AppError({ message: error.message as string, status: Responces.BAD_REQUEST });
  }
}

export default connectToDatabase;
