import { Response, Request, NextFunction, ErrorRequestHandler } from 'express'
import logger from '../utils/logger'
import AppError from '../utils/app_error'
import { ErrorLogInfo, MongooseCastError, MongooseDuplicateKeyError, MongooseValidationError, JsonWebTokenError } from '../types/errors'
// import getSystemInfo from '../utils/system-info'

interface ErrorWithStatus {
  status?: number
  message: string
  stack?: string
  name?: string
}

function isMongooseCastError(error: unknown): error is MongooseCastError {
  const mongoError = error as MongooseCastError
  return mongoError?.name === 'CastError' && 'kind' in mongoError && 'path' in mongoError
}

function isMongooseDuplicateKeyError(error: unknown): error is MongooseDuplicateKeyError {
  const mongoError = error as MongooseDuplicateKeyError
  return (mongoError?.name === 'MongoError' || mongoError?.name === 'MongoServerError') && mongoError?.code === 11000
}

function isMongooseValidationError(error: unknown): error is MongooseValidationError {
  const validationError = error as MongooseValidationError
  return validationError?.name === 'ValidationError' && 'errors' in validationError
}

function isJsonWebTokenError(error: unknown): error is JsonWebTokenError {
  const jwtError = error as JsonWebTokenError
  return jwtError?.name === 'JsonWebTokenError'
}

const errorHandler: ErrorRequestHandler = (
  err: Error | AppError | ErrorWithStatus | MongooseCastError | MongooseDuplicateKeyError | MongooseValidationError | JsonWebTokenError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  err.message = err.message || 'Internal server error'

  if (res.headersSent) {
    return next(err)
  }

  // Handle JWT Errors
  if (isJsonWebTokenError(err)) {
    const message = 'HQ: Json web token is invalid, try again.'
    // logger.info(message);
    err = new AppError({
      message: message,
      status: 400,
    })
  }

  // Handle Mongoose Cast Errors (Invalid ObjectId)
  if (isMongooseCastError(err)) {
    const message = `HQ: Resource not found, Invalid ID at path ${err.path}`
    // logger.info(message);
    err = new AppError({
      message: message,
      status: 400,
    })
  }

  // Handle Mongoose Duplicate Key Errors
  if (isMongooseDuplicateKeyError(err)) {
    const field = Object.keys(err.keyValue)[0]
    const message = `HQ: Duplicate ${field} entered`
    // logger.info(message);
    err = new AppError({
      message: message,
      status: 400,
    })
  }

  // Handle Mongoose Duplicate Key Errors
  if (isMongooseValidationError(err)) {
    const message = `HQ: Validation error ${err.message}`
    // logger.info(message);
    err = new AppError({
      message: message,
      status: 400,
    })
  }

  // Reference error
  if (err.name === 'ReferenceError') {
    // For critical reference errors, log and terminate the process
    err = new AppError({
      message: `Server is shutting down due to uncaught exception: ${err.message}`,
      status: 500,
    })
    logger.error(err.message, { stack: err.stack })
    process.exit(1)
  }

  // If request context is missing, log as an uncaught exception and exit
  if (!req) {
    logger.error('Uncaught exception with no request context', {
      error: err.message,
      stack: err.stack,
    })
    process.exit(1)
  }

  // Determine status code (default to 500 for unknown errors)
  const status = err instanceof AppError ? err.status : (err as ErrorWithStatus)?.status || 500

  const logInfo: ErrorLogInfo = {
    url: req?.originalUrl || req?.url,
    method: req?.method,
    ip: req?.ip,
    params: req?.params as Record<string, unknown>,
    query: req?.query as Record<string, unknown>,
    host: req?.hostname,
    referrerUrl: req?.headers['referer'],
    userAgent: req?.headers['user-agent'],
    error: {
      status: status,
      msg: err.message,
      // stack: err.stack,
    },
    // cookies: req?.cookies,
    // responseTime: Date.now() - req?.createdAt,
  }

  // logger.info('User request info', {
  //   method: req.method,
  //   url: req.url,
  //   systemInfo: getSystemInfo(),
  // })

  // Log the error details with full context
  logger.error({
    'HQ-Error': logInfo,
  })

  res.status(status).json({
    message: err.message || 'Internal Server Error',
  })
  return
}

export default errorHandler
