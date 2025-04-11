export const REDIS_LIMITER = {
  CREATE_SEARCH_LIMITER_PREFIX: 'cp:search:' as const,
  READ_SEARCH_LIMITER_PREFIX: 'rp:search:' as const,
}

export const SEARCH_SERVICE = {
  NEW_SEARCH_KEY_PREFIX: 'searches:cr',
  SINGLE_SEARCH_KEY_PREFIX: 'searches:snglp',
}

export const RABBITMQ_CONSUME_QUEUES = {
  SEARCH_QUEUE: 'search_queue',
}

export const EXCHANGE_NAMES = {
  SEARCH_EVENTS: 'search_events',
}

export const RABBITMQ_EVENTS = {
  POST_RELLATED_EVENTS: ['post:created', 'post:deleted'],
}
