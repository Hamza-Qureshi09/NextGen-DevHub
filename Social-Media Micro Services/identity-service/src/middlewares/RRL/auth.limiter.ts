import { rateLimiterConfigs } from '../../conf/rrl.config'
import { createRateLimiter } from './base_RRL.mdlw'
import { REDIS_LIMITER } from '../../constants/general.constants'

export const authLimiter = createRateLimiter({
  ...rateLimiterConfigs.auth,
  prefix: REDIS_LIMITER.AUTH_LIMITER_PREFIX,
})
export const sessionSpecificAuthLimiter = createRateLimiter({
  ...rateLimiterConfigs.sessionSpecific,
  prefix: REDIS_LIMITER.AUTH_LIMITER_PREFIX,
})
