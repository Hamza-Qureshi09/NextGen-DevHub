import winston from 'winston'
import path from 'path'
import { EnvConfig } from '../conf/env_config'

const env = EnvConfig.NODE_ENV || 'development'
const isProduction = env === 'production'

const logDir = path.join(__dirname, '../../logs')
const errorLogPath = path.join(logDir, 'errors.log')
const combinedLogPath = path.join(logDir, 'combined.log')

// Custom log format for console
const logFormat = winston.format.printf(({ level, message, timestamp, stack, ...metadata }) => {
  let metaInfo = Object.keys(metadata).length ? `\nMETA: ${JSON.stringify(metadata, null, 2)}` : ''

  return `[${timestamp}] [${level.toUpperCase()}]${metaInfo}\nMESSAGE: ${message}${stack ? `\nSTACK: ${stack}` : ''}`
})
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss A' }),
  winston.format.colorize({ all: true }),
  winston.format.errors({ stack: true }),
  logFormat,
)

// Combine log format for file
const combineFileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss A' }),
  // winston.format.label({ label: 'HQ_ERROR_LOG:' }),
  winston.format.json(),
)
// Error log format for file
const errorFileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.label({ label: 'HQ_ERROR_LOG:' }),
  winston.format.json(),
)

const transports = []
transports.push(
  new winston.transports.File({
    filename: errorLogPath,
    level: 'error',
    lazy: true,
    format: errorFileFormat,
    handleExceptions: true,
    handleRejections: true,
    maxsize: 5 * 1024 * 1024, // 5MB
    maxFiles: 5,
  }),
  new winston.transports.File({
    filename: combinedLogPath,
    format: combineFileFormat,
    lazy: true,
    handleExceptions: true,
    handleRejections: true,
    maxsize: 5 * 1024 * 1024, // 5MB
    maxFiles: 5,
  }),
)

if (!isProduction) {
  transports.push(
    new winston.transports.Console({
      format: consoleFormat,
    }),
  )
}

const logger = winston.createLogger({
  level: isProduction ? 'info' : 'debug',
  defaultMeta: { service: 'identity-service' },
  transports: transports,
})
export default logger
