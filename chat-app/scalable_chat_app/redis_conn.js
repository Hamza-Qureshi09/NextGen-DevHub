const redis = require("ioredis");

const RedisConnectionConf = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  //   tls: {
  //     host: process.env.REDIS_HOST,
  //     rejectUnauthorized: false,
  //   },
};

const ioRedisClient = () => {
  // Create a new Redis client instance with the desired configuration
  //   const client = redis.createClient(RedisConnectionConf);
  const client = new redis(process.env.UPSTASH_REDIS_URL); // UPSTASH Connection

  // Add event listeners directly to the client instance
  client.on("connect", () => console.info("Connected to Redis Local  🚀"));
  client.on("error", (err) => {
    console.error("Error:", err);
  });

  // Return the created Redis client
  return client;
};

module.exports = { ioRedisClient, RedisConnectionConf };
