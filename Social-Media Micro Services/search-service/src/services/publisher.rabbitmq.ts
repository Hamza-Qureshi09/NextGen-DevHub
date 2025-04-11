import logger from '../utils/logger'
import { channel, connectRabbitMQ } from '../connections/rabbitmq.conn'
import { ConfirmChannel } from 'amqplib'

// 💣🔥  IMPORTANT NOTE ABOUT EXCHANGE 💣🔥
// 1. Direct Exchange (for 1-to-1 communication, e.g., populated data request).
// 2. Topic Exchange (for 1-to-many communication based on routing keys).
// 3. Fanout Exchange (for broadcast messages, like cache clearing).

export const publishEvent = async (exchange: string, routingKey: string, message: any) => {
  if (!channel) {
    logger.info('🔄 Re-Establishing RabbitMQ connection.')
    await connectRabbitMQ()
  }

  await channel?.assertExchange(exchange, 'direct', { durable: true }) // Use 'direct' for strict 1-to-1 routing

  return new Promise<void>((resolve, reject) => {
    ;(channel as ConfirmChannel)?.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(message)),
      {
        persistent: true, // Ensures messages survive crashes
        mandatory: true, // Returns message if no queue is bound
      },
      (err, ok) => {
        if (err) {
          logger.error(`❌ Failed to publish event: ${routingKey}`, err)
          reject(err)
        } else {
          logger.info(`[ ✅ ] Event Published/Sent: ${routingKey} -> ${exchange}`)
          resolve()
        }
      },
    )
  })
}
