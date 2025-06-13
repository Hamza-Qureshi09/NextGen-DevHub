import { rateLimiterConfigs } from '../../config/rrl.config';
import { createRateLimiter } from './base_RRL.mdlw';

const mediaLimiter = createRateLimiter({
  ...rateLimiterConfigs.media,
  prefix: 'rl:media:',
});

export default mediaLimiter;
