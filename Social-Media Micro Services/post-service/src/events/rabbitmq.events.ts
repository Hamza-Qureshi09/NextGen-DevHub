import logger from '../utils/logger'
import RedisConn from '../connections/redis.conn'
import { REDIS_RQST_RESP_CYCLE } from '../constants/general.constants'
// import { publishEvent } from '../services/publisher.rabbitmq'

export const PostEventHandler = (msg: any, routingKey: string) => {
  switch (routingKey) {
    case 'resp:populated_media':
      PopulatedMediaRqstResponse(msg)
      break

    default:
      logger.warn(`❌ Unhandled event type: ${routingKey}`)
  }
}

// 1. populated media reques
export const PopulatedMediaRqstResponse = async (message: any) => {
  try {
    logger.info('✅ Populated Media Event Received')
    const ioRedisClient = RedisConn.ioRedisClient
    // console.info(message)

    const {
      eventSubType,
      data: { requestId, media },
    } = message

    // RQST-RESP CYCLE
    await Promise.all([
      // ✅ Store Response in Redis
      ioRedisClient.setex(`${REDIS_RQST_RESP_CYCLE.MEDIA_RESP_}${requestId}`, 10, JSON.stringify(media)),

      // ✅ Delete the pending request entry
      ioRedisClient.del(`${REDIS_RQST_RESP_CYCLE.MEDIA_REQ_}${requestId}`),
    ])
  } catch (error) {
    logger.error('❌ Error occurred during media deletion:', error)
    return
  }
}
