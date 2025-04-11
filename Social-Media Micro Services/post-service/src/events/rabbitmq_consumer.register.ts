import { RABBITMQ_CONSUME_QUEUES, RABBITMQ_EVENTS } from '../constants/general.constants'
import { PostEventHandler } from './rabbitmq.events'
import logger from '../utils/logger'
import { consumeEvent } from '../services/consumer.rabbitmq'

export const RegisterAllRabbitMQEvents = async () => {
  // consumming all events
  try {
    await Promise.all([
      // 1. subscribe to post related events
      consumeEvent('media_events', RABBITMQ_EVENTS.INCOMMING_EVENTS, RABBITMQ_CONSUME_QUEUES.POST_QUEUE, PostEventHandler),
    ])

    logger.info('✅ All RabbitMQ Event Listeners Registered Successfully')
  } catch (error) {
    logger.error('❌ Error in RegisterAllRabbitMQEvents:', error)
  }
}
