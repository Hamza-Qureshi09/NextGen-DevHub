import winston from 'winston';
import path from 'path';
import { EnvConfig } from '../config/env.config';

const env = EnvConfig.NODE_ENV || 'development';
const isProduction = env === 'production';

const logDir = path.join(__dirname, '../../logs');
const errorLogPath = path.join(logDir, 'errors.log');
const combinedLogPath = path.join(logDir, 'combined.log');

// Custom log format for console
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ level, message, timestamp, stack, ...metadata }) => {
    let log = `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
    if (stack) log += `\nSTACK: ${stack}`; // if stack availiable then add stack
    if (Object.keys(metadata).length > 0) {
      log += `\nMETA: ${JSON.stringify(metadata, null, 2)}`;
    }
    return log;
  })
);

// Custom log format for files
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ level, message, timestamp, stack, ...metadata }) => {
    let log = `\tTimestamp: ${timestamp}\n\tLevel: ${level.toUpperCase()}\n\tMessage: ${message}`;
    if (stack) log += `\n\tStack: ${stack}`; // if stack availiable then add stack
    if (Object.keys(metadata).length > 0) {
      log += `\n\tMeta: ${JSON.stringify(metadata, null, 2)}`;
    }
    return log;
  }),
  // winston.format.label({ label: 'LOG:' }),
  // winston.format.timestamp(),
  winston.format.json()
);

const transports = [];
transports.push(
  new winston.transports.File({
    filename: errorLogPath,
    level: 'error',
    lazy: true,
    format: fileFormat,
    handleExceptions: true,
    handleRejections: true,
    maxsize: 5 * 1024 * 1024, // 5MB
    maxFiles: 5,
  }),
  new winston.transports.File({
    filename: combinedLogPath,
    format: fileFormat,
    lazy: true,
    handleExceptions: true,
    handleRejections: true,
    maxsize: 5 * 1024 * 1024, // 5MB
    maxFiles: 5,
  })
);

if (!isProduction) {
  transports.push(
    new winston.transports.Console({
      format: consoleFormat,
    })
  );
}

const logger = winston.createLogger({
  level: isProduction ? 'info' : 'debug',
  defaultMeta: { service: 'WWEB-js-HQ' },
  transports: transports,
});
export default logger;
