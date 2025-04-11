// @MODE:- Route base ip rate limiing
export const SearchRateLimiterConfigs = {
  // 1 mint me 5 create posts rqsts
  search: {
    windowMs: 5 * 60 * 1000, // 5 minute
    max: 200, // 200 requests per window
    message: "Search routes rate limit hit",
  },
};
