import Redis from "ioredis";
import { POST_SERVICE } from "../constants/general.constants";

export const invalidatePostCache = async (req: any, input: any) => {
  const redisClient = req.redisClient as Redis;

  const cacheKey = SINGLE_POST_KEY(input);
  await redisClient.del(cacheKey);

  const keys = await redisClient.keys("posts:*");

  // delete all posts related cache [cr,sngl]
  if (keys?.length > 0) {
    await redisClient.del(keys);
  }
};

export const NEW_POST_KEY = (page: number, limit: number) => {
  return `${POST_SERVICE.NEW_POST_KEY_PREFIX}:${page}:${limit}`;
};
export const SINGLE_POST_KEY = (postId: string) => {
  return `${POST_SERVICE.SINGLE_POST_KEY_PREFIX}:${postId}`;
};
