// @MODE:- DDOS protection Global middleware
export const redisRateLimitConfigs = {
  post: {
    keyPrefix: "post-service:rate_limiting_middleware",
    points: 101, // Max allowed requests per `duration`
    duration: 300, // Time window in seconds (300 seconds = 5 minutes)
  },
};
