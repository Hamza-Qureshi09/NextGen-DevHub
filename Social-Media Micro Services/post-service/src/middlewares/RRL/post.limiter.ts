import {
  createPostRateLimiterConfigs,
  readPostRateLimiterConfigs,
} from "../../conf/rrl.config";
import { createRateLimiter } from "./base_RRL.mdlw";
import { REDIS_LIMITER } from "../../constants/general.constants";

export const createPostLimiter = createRateLimiter({
  ...createPostRateLimiterConfigs.post,
  prefix: REDIS_LIMITER.CREATE_POST_LIMITER_PREFIX,
});
export const readPostLimiter = createRateLimiter({
  ...readPostRateLimiterConfigs.post,
  prefix: REDIS_LIMITER.READ_POST_LIMITER_PREFIX,
});

// export default postLimiter;
