// @MODE:- DDOS protection Global middleware
export const redisRateLimitConfigs = {
  auth: {
    keyPrefix: 'identity-service:rate_limiting_middleware',
    points: 500,
    duration: 300, // 5 minute
  },
}
