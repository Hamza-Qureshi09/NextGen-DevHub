require("dotenv").config();

export const EnvConfig = {
  PORT: process.env.PORT || 3003,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URI: process.env.DATABASE_URI || "",
  RESOURCE_ORIGIN: process.env.RESOURCE_ORIGIN || "http://localhost:3000",
  XSS_PROTECTION: process.env.XSS_PROTECTION || "",

  // Redis related
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379/",
  REDIS_HOST: process.env.REDIS_HOST || "localhost",
  REDIS_PORT: process.env.REDIS_PORT || "6379",
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || "hamzaqureshi2909",

  // Cloudinary related settings
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",

  // multer related
  FILE_MAX_TOTAL_SIZE:
    parseInt(process.env.FILE_MAX_TOTAL_SIZE as string) || 5 * 1024 * 1024,

  // rabbit mq related
  RABBITMQ_URL: process.env.RABBITMQ_URL || "amqp://localhost:5672",
};
