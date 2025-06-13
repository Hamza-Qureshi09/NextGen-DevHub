import { rateLimiterConfigs } from '../../config/rrl.config';
import { createRateLimiter } from './base_RRL.mdlw';

const authLimiter = createRateLimiter({
  ...rateLimiterConfigs.auth,
  prefix: 'rl:auth:',
});

export default authLimiter;
