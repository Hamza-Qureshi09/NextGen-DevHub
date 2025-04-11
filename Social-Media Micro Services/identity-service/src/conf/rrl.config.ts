// @MODE:- Route base ip rate limiing
export const rateLimiterConfigs = {
  auth: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 10, // 10 requests per window
    message: 'Auth routes rate limit hit',
  },
  sessionSpecific: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 500, // 500 requests per window
    message: 'Session route rate limit hit',
  },
}
