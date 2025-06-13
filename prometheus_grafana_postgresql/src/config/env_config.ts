require("dotenv").config();

export const EnvConfig = {
  PORT: process.env.PORT || 6002,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URI: process.env.DATABASE_URI || "",
};
