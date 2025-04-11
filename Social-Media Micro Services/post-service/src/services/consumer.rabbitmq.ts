import logger from '../utils/logger'
import { channel, connectRabbitMQ } from '../connections/rabbitmq.conn'
import { ConfirmChannel } from 'amqplib'

export const consumeEvent = async (exchange: string, routingKeys: string[], queue: string, callback: (msg: any, routingKey: string) => void) => {
  if (!channel) {
    logger.info('Re-Establishing RabbitMQ connection.')
    await connectRabbitMQ()
  }

  await (channel as ConfirmChannel)?.assertExchange(exchange, 'direct', { durable: true })
  const q = await (channel as ConfirmChannel)?.assertQueue(queue, { durable: true }) // Ensure the queue is durable

  // Bind multiple routing keys to a single queue
  const bindMultipleQueue = async (queue: string, keys: string[]) => {
    for (const key of keys) {
      await (channel as ConfirmChannel)?.bindQueue(queue, exchange, key)
    }
  }

  // Bind queues with multiple event routing keys
  await bindMultipleQueue(queue, routingKeys)

  await (channel as ConfirmChannel)?.consume(
    q?.queue as string,
    (msg) => {
      if (msg !== null) {
        try {
          const content = JSON.parse(msg.content.toString())
          const routingKey = msg?.fields?.routingKey // Get event type from message
          callback(content, routingKey)
          channel?.ack(msg) // Acknowledge message
        } catch (error: any) {
          logger.error(`❌ Error processing message: ${error.message}`, error)

          // ❗ Reject the message and requeue it for another attempt
          channel?.nack(msg, false, true)
        }
      }
    },
    { noAck: false }, // Ensure manual acknowledgment
  )

  // logger.info(`[ ✅ ] Subscribed to Exchange: ${exchange}, Queue: ${queue}, Routing Key: ${routingKey}`)
}
