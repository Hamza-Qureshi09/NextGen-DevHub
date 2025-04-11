import { RABBITMQ_CONSUME_QUEUES, RABBITMQ_EVENTS } from '../constants/general.constants'
import { PostEventHandler } from './rabbitmq.events'
import { consumeEvent } from '../services/consumer.rabbitmq'
import logger from '../utils/logger'

export const RegisterAllRabbitMQEvents = async () => {
  // consumming all events
  try {
    await Promise.all([
      // 1. subscribe to post related events
      consumeEvent('post_events', RABBITMQ_EVENTS.POST_RELLATED_EVENTS, RABBITMQ_CONSUME_QUEUES.SEARCH_QUEUE, PostEventHandler),
    ])

    logger.info('✅ All RabbitMQ Event Listeners Registered Successfully')
  } catch (error) {
    logger.error('❌ Error in RegisterAllRabbitMQEvents:', error)
  }
}
