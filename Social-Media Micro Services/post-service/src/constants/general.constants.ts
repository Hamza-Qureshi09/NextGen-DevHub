export const REDIS_LIMITER = {
  CREATE_POST_LIMITER_PREFIX: 'cp:post:' as const,
  READ_POST_LIMITER_PREFIX: 'rp:post:' as const,
}

export const POST_SERVICE = {
  NEW_POST_KEY_PREFIX: 'posts:cr',
  SINGLE_POST_KEY_PREFIX: 'posts:snglp',
}

export const RABBITMQ_CONSUME_QUEUES = {
  POST_QUEUE: 'post_queue',
}

export const EXCHANGE_NAMES = {
  // my own service (publisher)
  POST_EVENTS: 'post_events',

  // listening other services exchangers
  MEDIA_EVENTS: 'media_events',
}

export const RABBITMQ_EVENTS = {
  // listeninge events
  INCOMMING_EVENTS: ['resp:populated_media'],

  // sending events
  POST_CREATED: 'post:created',
  POST_DELETED: 'post:deleted',
  RQST_POPULATED_MEDIA: 'rqst:populated_media',
}

export const REDIS_RQST_RESP_CYCLE = {
  MEDIA_REQ_: 'media_req_' as const,
  MEDIA_RESP_: 'media_resp_' as const,
}
