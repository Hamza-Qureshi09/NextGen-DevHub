export const rateLimiterConfigs = {
  auth: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 50, // 50 requests per window
    message: 'Auth routes rate limit hit',
  },
  posts: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: 'Posts routes rate limit hit',
  },
  media: {
    windowMs: 30 * 60 * 1000, // 30 minutes
    max: 200, // 200 requests per window
    message: 'Media routes rate limit hit',
  },
};
