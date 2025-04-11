import express, { Application, Request, Response, NextFunction } from 'express'
import Redis from '../connections/redis.conn'
import { rateLimit } from 'express-rate-limit'
import { RedisStore, RedisReply } from 'rate-limit-redis'
import { Messages, Responces } from '../utils/responses'
import logger from '../utils/logger'
const { ioRedisClient } = Redis

// @MODE:- Sensitive Routes Limiter
// IP Based Rate Limiting for sensitive endpoints/routes
const sensitiveEndPointsLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minute
  max: 50, // Limit each IP to 50 requests per `window` (here, per 5 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    logger.info(`Senesitive endpoint rate limit exceeded for IP: ${req.ip}`)
    return res.status(Responces.TOO_MANY_RQSTS).json({ message: Messages.TOO_MANY_RQSTS + ' routes rate limit hit' })
  },
  store: new RedisStore({
    sendCommand: (...args: string[]): Promise<RedisReply> => {
      const command = args[0] // First argument is the Redis command
      const parameters = args.slice(1) // Remaining arguments are parameters
      return ioRedisClient.call(command, parameters) as Promise<RedisReply>
    },
  }),
})

const IPRouteRateLimitter = { sensitiveEndPointsLimiter }

export default IPRouteRateLimitter
