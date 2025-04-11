import http from 'http'
import express, { Application, Request, Response, NextFunction } from 'express'
import { EnvConfig } from './conf/env_config'
import errorHandler from './middlewares/errorHandler'
import getSystemInfo from './utils/system-info'
import { SystemInfo } from './types/general'
import logger from './utils/logger'
import connectToDatabase from './connections/db.conn'
// import Redis from './connections/redis.conn'
import ApplicationMiddlewares from './middlewares/application.middlewares'

// routes
import AuthRoutes from './routes/identity_service.routes'

// declare module 'express-serve-static-core' {
//   interface Request {
//     systemInfo?: SystemInfo
//   }
// }

declare global {
  namespace Express {
    interface Request {
      systemInfo: SystemInfo
      userInfo?: any
    }
  }
}

const systemInfoMiddlewareInfo = (req: Request, res: Response, next: NextFunction) => {
  const getUsage = getSystemInfo()
  req.systemInfo = getUsage.systemInfo
  next()
}

const identityService = async () => {
  try {
    // handling uncaught exception
    process.on('uncaughtException', (err) => {
      logger.info(`Error: ${err.message}`)
      logger.info('server is shutting down due to handling uncaught exception')
      process.exit(1)
    })

    // Initialize the server
    const app: Application = express()
    const httpServer = http.createServer(app)
    const Port = EnvConfig.PORT || 3001

    // Databases connection
    await connectToDatabase()
    // const { ioRedisClient } = Redis

    // Middlewares
    app.use(systemInfoMiddlewareInfo)
    await ApplicationMiddlewares(app)

    // Routes
    app.use('/api/auth', AuthRoutes)

    // Test | Health Routes
    app.get('*/api/hq$', (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.systemInfo) throw new Error('System info not available')
        // return next(new AppError({ message: 'hello hamza', status: 404 }))

        res.status(200).json({
          msg: 'success',
          systemInfo: req.systemInfo,
          data: 'hello hamza from auth service!',
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

    // Start the server
    const server = httpServer.listen(Port, () => {
      logger.info(`Task Worker:- ${process.pid} is assigned.\nIdentity-Service is running on this url: http://localhost:${Port} `)
    })

    // unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      logger.info(`server is shutting down due to unhandled promise rejection, Error: ${err}`)
      server.close(() => {
        process.exit(1)
      })
    })
  } catch (error) {
    logger.error('Unhandled error:', error)
  }
}
identityService().catch((error: unknown) => {
  logger.error('Unhandled error:', error)
})
