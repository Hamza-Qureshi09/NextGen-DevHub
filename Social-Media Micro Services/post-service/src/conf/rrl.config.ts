// @MODE:- Route base ip rate limiing
export const createPostRateLimiterConfigs = {
  // 1 mint me 5 create posts rqsts
  post: {
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5, // 100 requests per window
    message: "Post routes rate limit hit",
  },
};
export const readPostRateLimiterConfigs = {
  // 5 mint me 100 get posts rqsts
  post: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 100, // 100 requests per window
    message: "Post routes rate limit hit",
  },
};
