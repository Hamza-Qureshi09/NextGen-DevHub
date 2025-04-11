require('dotenv').config()

export const EnvConfig = {
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  XSS_PROTECTION: process.env.XSS_PROTECTION || '',
  CROSS_ORIGINS: [process.env.RESOURCE_ORIGIN, process.env.IDENTITY_SERVICE_URL, process.env.POST_SERVICE_URL],
  RESOURCE_ORIGIN: process.env.RESOURCE_ORIGIN || 'http://localhost:3000',
  JWT_SECRET: process.env.JWT_SECRET || '',

  // services related
  IDENTITY_SERVICE_URL: process.env.IDENTITY_SERVICE_URL || 'http://localhost:3001',
  POST_SERVICE_URL: process.env.POST_SERVICE_URL || 'http://localhost:3002',
  MEDIA_SERVICE_URL: process.env.MEDIA_SERVICE_URL || 'http://localhost:3003',
  SEARCH_SERVICE_URL: process.env.SEARCH_SERVICE_URL || 'http://localhost:3004',

  // redis related
  REDIS_URL: process.env.REDIS_URL || 'redis://:mypassword@localhost:6379',
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: process.env.REDIS_PORT || '6379',
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || 'hamzaqureshi2909',
}
