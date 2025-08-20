import { rateLimiterConfigs } from '../../config/rrl.config';
import { createRateLimiter } from './base_RRL.mdlw';

const postsLimiter = createRateLimiter({
  ...rateLimiterConfigs.posts,
  prefix: 'rl:posts:',
});

export default postsLimiter;
