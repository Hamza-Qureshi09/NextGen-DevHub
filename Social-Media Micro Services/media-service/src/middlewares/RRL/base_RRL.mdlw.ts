import { rateLimit } from "express-rate-limit";
import { RedisStore, RedisReply } from "rate-limit-redis";
import { Messages, Responces } from "../../utils/responses";
import Redis from "../../connections/redis.conn";
import logger from "../../utils/logger";
const { ioRedisClient } = Redis;

// @MODE:- Sensitive Routes Limiter
// IP Based Rate Limiting for sensitive endpoints/routes
export const createRateLimiter = (config: {
  windowMs: number;
  max: number;
  message: string;
  prefix?: string;
}) => {
  return rateLimit({
    windowMs: config.windowMs,
    max: config.max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.info(
        `Rate limit exceeded for IP: ${req.ip} on ${
          config.prefix || "unknown"
        } routes`
      );
      return res.status(Responces.TOO_MANY_RQSTS).json({
        message: Messages.TOO_MANY_RQSTS + " " + config.message,
      });
    },
    store: new RedisStore({
      sendCommand: (...args: string[]): Promise<RedisReply> => {
        const command = args[0];
        const parameters = args.slice(1);
        return ioRedisClient.call(command, parameters) as Promise<RedisReply>;
      },
      prefix: config.prefix || "default:media:", // Adding prefix to distinguish b/w different limiters in Redis
    }),
  });
};
