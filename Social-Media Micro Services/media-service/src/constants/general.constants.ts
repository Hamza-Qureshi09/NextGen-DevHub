import path from 'path'

export const REDIS_LIMITER = {
  CREATE_MEDIA_LIMITER_PREFIX: 'cp:media:' as const,
}

export const UPLOADS_FOLDER = path.join(__dirname, '../uploads')
export const MAX_UPLOAD_FILES = 5

export const RABBITMQ_CONSUME_QUEUES = {
  MEDIA_QUEUE: 'media_queue',
}
export const EXCHANGE_NAMES = {
  // my own service (publisher)
  MEDIA_EVENTS: 'media_events',

  // listening other services exchangers
  POST_EVENTS: 'post_events',
}
export const RABBITMQ_EVENTS = {
  // listeninge events
  INCOMMING_EVENTS: ['post:deleted', 'rqst:populated_media'],

  // sending events
  RESP_POPULATED_MEDIA: 'resp:populated_media',
}
