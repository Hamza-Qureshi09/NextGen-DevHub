import RedisConn from '../connections/redis.conn'

// Waits for a response in Redis and returns the data once available.
export const waitForResponse = async (requestId: string, responseKeyPrefix: string, timeout: number = 10000): Promise<any> => {
  const ioRedisClient = RedisConn.ioRedisClient
  return new Promise((resolve, reject) => {
    const redisKey = `${responseKeyPrefix}${requestId}`

    const checkResponse = async () => {
      const data = await ioRedisClient.get(redisKey)
      if (data) {
        resolve(JSON.parse(data))
        await ioRedisClient.del(redisKey) // Clean up Redis
      } else {
        setTimeout(checkResponse, 1000) // Poll every second
      }
    }

    setTimeout(() => {
      reject(new Error(`Service did not respond in time for requestId: ${requestId}`))
    }, timeout)

    checkResponse()
  })
}
