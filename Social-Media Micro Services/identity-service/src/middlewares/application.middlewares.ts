import express, { Application, Request, Response, NextFunction } from 'express'
import Redis from '../connections/redis.conn'
import { RateLimiterRedis } from 'rate-limiter-flexible'
import mongoSanitize from 'express-mongo-sanitize'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import logger from '../utils/logger'
import { Messages, Responces } from '../utils/responses'
import { EnvConfig } from '../conf/env_config'
import { redisRateLimitConfigs } from '../conf/redis_rl.config'

const ApplicationMiddlewares = async (app: Application) => {
  const { ioRedisClient } = Redis

  // @MODE:- Required Middlewares
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json({ limit: '30mb' }))
  app.use(morgan('common'))
  app.use(cookieParser())

  // @MODE:- Cors setup
  app.use(
    cors({
      credentials: true,
      origin: EnvConfig.RESOURCE_ORIGIN,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
      exposedHeaders: ['Frsc-t'],
      preflightContinue: true,
      optionsSuccessStatus: 204,
    }),
  )

  // @MODE:- DDOS protection
  const rateLimiter = new RateLimiterRedis({
    storeClient: ioRedisClient,
    ...redisRateLimitConfigs.auth,
  })
  app.use((req: Request, res: Response, next: NextFunction) => {
    rateLimiter
      .consume(req.ip as string)
      .then(() => next())
      .catch(() => {
        logger.warn(`Rate limit exceeded for IP: ${req.ip}`)
        return res.status(Responces.TOO_MANY_RQSTS).json({ message: Messages.TOO_MANY_RQSTS })
      })
  })

  // @MODE:- Mongoose Sanitization
  app.use(
    mongoSanitize({
      replaceWith: '*',
      allowDots: false,
    }),
  )

  // @MODE:- GZIP Compression
  app.use(
    compression({
      level: 6,
      threshold: 500,
      filter: (req, res) => {
        if (req.headers['x-no-compression']) {
          return false
        }
        return compression.filter(req, res)
      },
    }),
  )

  // @MODE:- Helmet for Security Headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", EnvConfig.RESOURCE_ORIGIN],
          styleSrc: ["'self'", 'https:'],
          imgSrc: ["'self'", 'data:'],
          connectSrc: ["'self'", EnvConfig.RESOURCE_ORIGIN],
          fontSrc: ["'self'", 'https:', 'data:'],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
      crossOriginOpenerPolicy: { policy: 'same-origin' }, // Helps with process isolation
      crossOriginResourcePolicy: { policy: 'same-site' }, // Prevents resource leakage 'same-origin' is also available
      originAgentCluster: true,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      strictTransportSecurity: {
        maxAge: 63072000, // 2 years
        includeSubDomains: true,
        preload: true,
      }, // Forces HTTPS
      xContentTypeOptions: true, // Prevents MIME type sniffing
      dnsPrefetchControl: { allow: false }, // Disables DNS prefetching
      xDownloadOptions: true, // Prevents automatic execution of downloads
      frameguard: { action: 'deny' }, // Prevents clickjacking
      permittedCrossDomainPolicies: { permittedPolicies: 'none' }, // Restricts cross-domain access
      xPoweredBy: true, // Hides Express framework info
      xXssProtection: false, // Disables buggy browser XSS protection (modern CSP is better)
    }),
  )
  // @MODE:- Custom Headers
  app.use((req, res, next) => {
    res.set('cross-origin-resource-policy', EnvConfig.RESOURCE_ORIGIN)
    res.set('Access-Control-Allow-Credentials', 'true')
    res.set('X-XSS-Protection', EnvConfig.XSS_PROTECTION)
    res.set('Access-Control-Expose-Headers', 'Frsc-t')
    next()
  })

  // Enable trust proxy to correctly identify the client's IP address
  // app.enable('trust proxy', true)
}

export default ApplicationMiddlewares
