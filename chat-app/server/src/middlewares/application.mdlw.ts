import express, { Application, Request, Response, NextFunction } from 'express';
import Redis from '../connections/redis.conn';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import logger from '../utils/logger';
import { Messages, Responces } from '../utils/responses';
import { EnvConfig } from '../config/env.config';

const ApplicationMiddlewares = async (app: Application) => {
  const { ioRedisClient } = Redis;

  // @MODE:- Required Middlewares
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json({ limit: '30mb' }));
  app.use(morgan('common'));
  app.use(cookieParser());

  // @MODE:- Cors setup
  app.use(
    cors({
      credentials: true,
      origin: EnvConfig.RESOURCE_ORIGIN,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'Frsc-t'],
      preflightContinue: true,
      optionsSuccessStatus: 200,
    })
  );

  // @MODE:- DDOS protection
  const rateLimiter = new RateLimiterRedis({
    storeClient: ioRedisClient,
    keyPrefix: 'whatsapp-webjs-HQ:rate_limiting_middleware',
    points: 50,
    duration: 60, // 1 minute
  });
  app.use((req: Request, res: Response, next: NextFunction) => {
    rateLimiter
      .consume(req.ip as string)
      .then(() => next())
      .catch(() => {
        logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
        return res.status(Responces.TOO_MANY_RQSTS).json({ message: Messages.TOO_MANY_RQSTS });
      });
  });

  // @MODE:- Mongoose Sanitization
  app.use(
    mongoSanitize({
      replaceWith: '*',
      allowDots: false,
    })
  );

  // @MODE:- GZIP Compression
  app.use(
    compression({
      level: 6,
      threshold: 100,
      filter: (req, res) => {
        if (req.headers['x-no-compression']) {
          return false;
        }
        return compression.filter(req, res);
      },
    })
  );

  // @MODE:- Helmet for Security Headers
  app.use(helmet.frameguard({ action: 'deny' })); // prevent clickjacking
  app.use(helmet.hidePoweredBy()); // X-Powered-By removing express
  app.use(helmet.ieNoOpen()); // X-Download-Options preventing potentially unsave downloads
  app.use(helmet.noSniff()); // preventing mime type sniffing
  app.use(helmet.xssFilter());
  app.use(helmet.dnsPrefetchControl({ allow: true })); // DNS prefetchingControl
  app.use(helmet.xXssProtection()); // preventing X-Xss
  app.use(helmet.contentSecurityPolicy({ useDefaults: true })); // applying (CSP)

  // @MODE:- Custom Headers
  app.use((req, res, next) => {
    res.set('cross-origin-resource-policy', EnvConfig.RESOURCE_ORIGIN);
    res.set('Access-Control-Allow-Credentials', 'true');
    res.set('X-XSS-Protection', EnvConfig.XSS_PROTECTION);
    res.set('Access-Control-Expose-Headers', 'Frsc-t');
    next();
  });

  // Enable trust proxy to correctly identify the client's IP address
  // app.enable('trust proxy', true)
};

export default ApplicationMiddlewares;
