// @MODE:- Route base ip rate limiing
export const createMediaRateLimiterConfigs = {
  // 1 mint me 5 create media rqsts
  media: {
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20, // 20 requests per window
    message: "Media routes rate limit hit",
  },
};
