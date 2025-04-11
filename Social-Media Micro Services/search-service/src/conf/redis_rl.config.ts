// @MODE:- DDOS protection Global middleware
export const redisRateLimitConfigs = {
  search: {
    keyPrefix: "search-service:rate_limiting_middleware",
    points: 201, // Max allowed requests per `duration`
    duration: 300, // Time window in seconds (300 seconds = 5 minutes)
  },
};
