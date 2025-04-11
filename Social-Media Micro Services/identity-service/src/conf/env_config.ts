require('dotenv').config()

export const EnvConfig = {
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URI: process.env.DATABASE_URI || '',
  RESOURCE_ORIGIN: process.env.RESOURCE_ORIGIN || 'http://localhost:3000',
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_EXPIRES_IN: (process.env.JWT_EXPIRES_IN as string) || '1h',
  JWT_RFRESH_EXPIRES_IN: process.env.JWT_RFRESH_EXPIRES_IN || '1d',
  XSS_PROTECTION: process.env.XSS_PROTECTION || '',
  ACCESS_COOKIE_EXPIRE: process.env.ACCESS_COOKIE_EXPIRE || '',
  REFRESH_COOKIE_EXPIRE: process.env.REFRESH_COOKIE_EXPIRE || '',

  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379/',
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: process.env.REDIS_PORT || '6379',
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || 'hamzaqureshi2909',
}
