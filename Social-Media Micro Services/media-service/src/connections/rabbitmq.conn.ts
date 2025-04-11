import logger from '../utils/logger'
import amqp, { ConfirmChannel } from 'amqplib'
import { EnvConfig } from '../conf/env_config'

let connection = null
export let channel: ConfirmChannel | null = null

export const connectRabbitMQ = async (): Promise<ConfirmChannel | null> => {
  if (channel) return channel // Avoid reconnecting if already connected

  try {
    connection = await amqp.connect(EnvConfig.RABBITMQ_URL)
    channel = await connection.createConfirmChannel()

    logger.info('✅ Connected to RabbitMQ')

    // Handle connection closed event
    connection.on('close', () => {
      logger.warn('⚠️ RabbitMQ connection closed. Reconnecting...')
      channel = null
      setTimeout(connectRabbitMQ, 5000)
    })

    // Handle connection errors
    connection.on('error', (err) => {
      logger.error('❌ RabbitMQ connection error:', err)
      channel = null
    })
    return channel
  } catch (error) {
    logger.error('❌ Failed to connect to RabbitMQ:', error)
    setTimeout(connectRabbitMQ, 5000) // Auto-reconnect on failure
    return null
  }
}
