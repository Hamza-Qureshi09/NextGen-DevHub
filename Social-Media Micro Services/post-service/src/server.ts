import http from 'http'
import { Redis } from 'ioredis'
import express, { Application, Request, Response, NextFunction } from 'express'
import { Post_User, SystemInfo } from './types/general'
import getSystemInfo from './utils/system-info'
import logger from './utils/logger'
import RedisConn from './connections/redis.conn'

// routes
import PostRoutes from './routes/post_service.routes'
import { EnvConfig } from './conf/env_config'
import ApplicationMiddlewares from './middlewares/application.middlewares'
import errorHandler from './middlewares/errorHandler'
import connectToDatabase from './connections/db.conn'
import { connectRabbitMQ } from './connections/rabbitmq.conn'
import { RegisterAllRabbitMQEvents } from './events/rabbitmq_consumer.register'

declare global {
  namespace Express {
    interface Request {
      systemInfo: SystemInfo
      userInfo?: any
      user: Post_User
      redisClient?: Redis
    }
  }
}

const systemInfoMiddlewareInfo = (req: Request, res: Response, next: NextFunction) => {
  const getUsage = getSystemInfo()
  req.systemInfo = getUsage.systemInfo
  next()
}
const postService = async () => {
  try {
    // handling uncaught exception
    process.on('uncaughtException', (err) => {
      logger.info('server is shutting down due to handling uncaught exception')
      logger.error(`Error: ${err.message}`)
      process.exit(1)
    })

    // Initialize the server
    const app: Application = express()
    const httpServer = http.createServer(app)
    const Port = EnvConfig.PORT || 3002

    // Databases connection
    await connectToDatabase()

    // Middlewares
    app.use(systemInfoMiddlewareInfo)
    await ApplicationMiddlewares(app)
    const ioRedisClient = RedisConn.ioRedisClient

    // Routes
    app.use(
      '/api/posts',
      async (req: Request, res: Response, next: NextFunction) => {
        req.redisClient = ioRedisClient
        next()
      },
      PostRoutes,
    )

    // Test | Health Routes
    app.get('*/api/hq$', (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.systemInfo) throw new Error('System info not available')

        res.status(200).json({
          msg: 'success',
          systemInfo: req.systemInfo,
          data: 'hello hamza from post service!',
        })
        return
      } catch (error) {
        next(error)
      }
    })

    // handle rest of the requests
    app.all('*', (req: Request, res: Response) => {
      if (req.accepts('json')) {
        res.status(404).json({ message: 'Not Found!' })
        return
      } else {
        res.status(404).type('txt').send('Not Found!')
        return
      }
    })

    // Apply Error Handler as Global Middleware
    app.use(errorHandler)

    // connection with rabbit MQ
    try {
      await connectRabbitMQ()

      // consume all the events
      await RegisterAllRabbitMQEvents()
    } catch (error) {
      logger.error('Failed to connect to RabbitMQ', error)
      process.exit(1)
    }

    // Start the server
    const server = httpServer.listen(Port, () => {
      logger.info(`Task Worker:- ${process.pid} is assigned.\nPost-Service is running on this url: http://localhost:${Port} `)
    })

    // unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      logger.error(`server is shutting down due to unhandled promise rejection, Error: ${err}`)
      server.close(() => {
        process.exit(1)
      })
    })
  } catch (error) {
    logger.error('Unhandled error:', error)
  }
}
postService().catch((error: unknown) => {
  logger.error('Unhandled error:', error)
})
