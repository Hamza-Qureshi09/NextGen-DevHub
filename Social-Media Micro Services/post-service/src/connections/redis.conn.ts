import ioRedis from "ioredis";
import { EnvConfig } from "../conf/env_config";
import { RedisConfig } from "../types/general";
// import logger from '../utils/logger'

const RedisConnectionConf: RedisConfig = {
  host: EnvConfig.REDIS_HOST as string,
  port: Number(EnvConfig.REDIS_PORT) as number,
  password: EnvConfig.REDIS_PASSWORD,
  tls: {
    host: EnvConfig.REDIS_HOST,
    rejectUnauthorized: false,
  },
};

// Create a new Redis client instance with the desired configuration
const ioRedisClient = new ioRedis(RedisConnectionConf);

// ✅ Event Handlers
ioRedisClient.on("connect", () => console.info("Connected to Redis 🚀"));
ioRedisClient.on("error", (err) => console.error("Redis Client Error:", err));
ioRedisClient.on("close", () => console.info("Redis Client Connection Closed"));
ioRedisClient.on("ready", () => console.info("Redis Client Ready"));

const ExportsHandler = { ioRedisClient, RedisConnectionConf, ioRedis };

export default ExportsHandler;
