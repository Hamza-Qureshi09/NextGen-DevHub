import { SearchRateLimiterConfigs } from "../../conf/rrl.config";
import { createRateLimiter } from "./base_RRL.mdlw";
import { REDIS_LIMITER } from "../../constants/general.constants";

export const searchPostLimiter = createRateLimiter({
  ...SearchRateLimiterConfigs.search,
  prefix: REDIS_LIMITER.CREATE_SEARCH_LIMITER_PREFIX,
});
