// @MODE:- DDOS protection Global middleware
export const redisRateLimitConfigs = {
  media: {
    keyPrefix: "media-service:rate_limiting_middleware",
    points: 21, // Max allowed requests per `duration`
    duration: 60, // Time window in seconds (60 seconds = 1 minute)
  },
};
