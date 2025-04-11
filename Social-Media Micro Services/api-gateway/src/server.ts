import http from 'http'
import zlib from 'zlib'
import express, { Application, Request, Response, NextFunction } from 'express'
import proxy from 'express-http-proxy'

import logger from './utils/logger'
import { EnvConfig } from './conf/env.config'
import errorHandler from './middlwares/errorHandler'
import GatewayMiddlewares from './middlwares/gateway.middlewares'
import IPRouteRateLimitter from './middlwares/gateway_rate_limit.middleware'
import AppError from './utils/app_errors'
import { validateToken } from './middlwares/auth.mdlw'

declare global {
  namespace Express {
    interface Request {
      userInfo?: any
    }
  }
}

const api_gateway = async () => {
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
    const Port = EnvConfig.PORT || 3000

    // Middlewares
    await GatewayMiddlewares(app)
    app.use(IPRouteRateLimitter.sensitiveEndPointsLimiter)

    // Proxy setup & Proxy options
    const proxyOptions = {
      proxyReqPathResolver: (req: Request) => {
        return req.originalUrl.replace(/^\/v1/, '/api')
      },
      proxyErrorHandler: function (err: any, res: Response, next: NextFunction) {
        logger.error(`Proxy error: ${err.message}`)
        new AppError({ message: err.message, status: 500 })
        // next(err)
      },
    }

    // handle proxies response & compression
    const handleResponseDecompression = (proxyRes: any, proxyResData: any, userRes: Response, serviceName: string) => {
      const encoding = proxyRes.headers['content-encoding']
      const transferEncoding = proxyRes.headers['transfer-encoding']
      let dataBuffer = Buffer.from(proxyResData)
      let decompressed = false

      try {
        if (encoding === 'gzip' && transferEncoding !== 'chunked') {
          logger.info(`[${serviceName}] Decompressing gzip response...`)
          dataBuffer = zlib.gunzipSync(dataBuffer)
          decompressed = true
        } else if (encoding === 'br') {
          logger.info(`[${serviceName}] Decompressing Brotli response...`)
          dataBuffer = zlib.brotliDecompressSync(dataBuffer)
          decompressed = true
        }
      } catch (error) {
        logger.error(`[${serviceName}] Decompression failed:`, error)
        return proxyResData // Return raw response on failure
      }

      // Convert Buffer to string
      let dataString
      try {
        dataString = dataBuffer.toString('utf8')
      } catch (error) {
        logger.error(`[${serviceName}] Buffer to string conversion failed:`, error)
        return proxyResData
      }

      // Parse JSON response
      let data
      try {
        data = JSON.parse(dataString)
      } catch (error) {
        logger.error(`[${serviceName}] JSON parsing failed:`, error)
        return proxyResData
      }

      logger.info(
        JSON.stringify(
          {
            from: `Proxy-${serviceName}`,
            statusCode: proxyRes.statusCode || '',
          },
          null,
          2,
        ),
      )

      if (decompressed) {
        userRes.setHeader('Content-Encoding', 'identity') // No compression
        userRes.setHeader('Content-Type', 'application/json')
      }

      return Buffer.from(JSON.stringify(data))
    }

    // setting proxies
    // Proxy for Auth Service
    app.use(
      '/v1/auth',
      proxy(EnvConfig.IDENTITY_SERVICE_URL, {
        ...proxyOptions,
        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
          proxyReqOpts.headers = proxyReqOpts.headers || {}
          proxyReqOpts.headers['content-type'] = 'application/json'
          return proxyReqOpts
        },

        userResDecorator: (proxyRes, proxyResData, userReq, userRes) => handleResponseDecompression(proxyRes, proxyResData, userRes, 'Auth-Service'),
      }),
    )

    // Proxy for Post Service
    app.use(
      '/v1/posts',
      validateToken,
      proxy(EnvConfig.POST_SERVICE_URL, {
        ...proxyOptions,
        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
          proxyReqOpts.headers = proxyReqOpts.headers || {}
          if (srcReq?.userInfo?.userId) {
            proxyReqOpts.headers['x-user-id'] = srcReq.userInfo.userId
          }

          // Ensure correct content-type for file uploads
          if (!srcReq.headers['content-type']?.startsWith('multipart/form-data')) {
            proxyReqOpts.headers['Content-Type'] = 'application/json'
          }

          return proxyReqOpts
        },

        userResDecorator: (proxyRes, proxyResData, userReq, userRes) => handleResponseDecompression(proxyRes, proxyResData, userRes, 'Post-Service'),
      }),
    )

    // Proxy for Media Service
    app.use(
      '/v1/media',
      validateToken,
      proxy(EnvConfig.MEDIA_SERVICE_URL, {
        ...proxyOptions,
        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
          proxyReqOpts.headers = proxyReqOpts.headers || {}
          if (srcReq?.userInfo?.userId) {
            proxyReqOpts.headers['x-user-id'] = srcReq.userInfo.userId
          }

          // Ensure correct content-type for file uploads
          if (!srcReq.headers['content-type']?.startsWith('multipart/form-data')) {
            proxyReqOpts.headers['Content-Type'] = 'application/json'
          }

          return proxyReqOpts
        },

        userResDecorator: (proxyRes, proxyResData, userReq, userRes) => handleResponseDecompression(proxyRes, proxyResData, userRes, 'Media-Service'),

        parseReqBody: false, // ensure entire request body is proxied for the file upload
      }),
    )

    // Proxy for Search Service
    app.use(
      '/v1/search',
      validateToken,
      proxy(EnvConfig.SEARCH_SERVICE_URL, {
        ...proxyOptions,
        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
          proxyReqOpts.headers = proxyReqOpts.headers || {}
          if (srcReq?.userInfo?.userId) {
            proxyReqOpts.headers['x-user-id'] = srcReq.userInfo.userId
          }

          // Ensure correct content-type for file uploads
          if (!srcReq.headers['content-type']?.startsWith('multipart/form-data')) {
            proxyReqOpts.headers['Content-Type'] = 'application/json'
          }

          return proxyReqOpts
        },

        userResDecorator: (proxyRes, proxyResData, userReq, userRes) =>
          handleResponseDecompression(proxyRes, proxyResData, userRes, 'Search-Service'),
      }),
    )

    // Routes
    // app.use('/api/auth', AuthRoutes)
    app.get('/sensitive', (_req: Request, res: Response) => {
      res.status(200).json({ msg: 'test route sensitive!' })
      return
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
      logger.info(`Task Worker:- ${process.pid} is assigned.\nAPI_Gateway is running on this url: http://localhost:${Port} `)
      logger.info(`Task Worker:- ${process.pid} is assigned.\nIdentity-Service is running on this url: ${EnvConfig.IDENTITY_SERVICE_URL} `)
      logger.info(`Task Worker:- ${process.pid} is assigned.\nPost-Service is running on this url: ${EnvConfig.POST_SERVICE_URL} `)
      logger.info(`Task Worker:- ${process.pid} is assigned.\nMedia-Service is running on this url: ${EnvConfig.MEDIA_SERVICE_URL} `)
      logger.info(`Task Worker:- ${process.pid} is assigned.\nSearch-Service is running on this url: ${EnvConfig.SEARCH_SERVICE_URL} `)
    })

    // unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.info(`server is shutting down due to unhandled promise rejection, Error: ${err}`)
      server.close(() => {
        process.exit(1)
      })
    })
  } catch (error) {
    console.error('Unhandled error:', error)
  }
}
api_gateway().catch((error: unknown) => {
  console.error('Unhandled error:', error)
})
