require('dotenv').config()

export const EnvConfig = {
  PORT: process.env.PORT || 3002,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URI: process.env.DATABASE_URI || '',
  RESOURCE_ORIGIN: process.env.RESOURCE_ORIGIN || 'http://localhost:3000',
  XSS_PROTECTION: process.env.XSS_PROTECTION || '',

  // Redis related
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379/',
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: process.env.REDIS_PORT || '6379',
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || 'hamzaqureshi2909',
  REDIS_CACHE_POSTS_EXPIRATION_SEC: parseInt(process.env.REDIS_CACHE_POSTS_EXPIRATION_SEC as string) || 300, // 5 minutes,
  REDIS_CACHE_SINGLE_POST_EXPIRATION_SEC: parseInt(process.env.REDIS_CACHE_SINGLE_POST_EXPIRATION_SEC as string) || 3600, // 1 hour,
  REDIS_RQST_RESP_CYCLE_EXPIRE_TIME: parseInt(process.env.REDIS_RQST_RESP_CYCLE_EXPIRE_TIME as string) || 10, // 10 sec,
  RQST_RESP_TIME_OUT: parseInt(process.env.RQST_RESP_TIME_OUT as string) || 10000, // 10000ms -> 10 sec,

  // rabbit mq related
  RABBITMQ_URL: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
}
