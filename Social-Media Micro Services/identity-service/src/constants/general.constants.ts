import path from 'path'
import { SystemInfo } from '../types/general'

export const REDIS_LIMITER = {
  AUTH_LIMITER_PREFIX: 'rl:auth:' as const,
}

export const RabbitMQ_EVENTS_LIST = {
  //   CLIENT_SESSION: 'whatsapp:client:',
  //   CLIENT_STATE: 'whatsapp:state:',
  //   CLIENT_EVENTS: 'whatsapp:events:',
  //   SOCKET_EVENTS: 'socket:events:',
  //   QR_ATTEMPTS: 'whatsapp:qr:',
}
