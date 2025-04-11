import { createMediaRateLimiterConfigs } from "../../conf/rrl.config";
import { createRateLimiter } from "./base_RRL.mdlw";
import { REDIS_LIMITER } from "../../constants/general.constants";

export const createPostLimiter = createRateLimiter({
  ...createMediaRateLimiterConfigs.media,
  prefix: REDIS_LIMITER.CREATE_MEDIA_LIMITER_PREFIX,
});
