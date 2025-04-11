import Redis from 'ioredis'
import { IPAGENATED_POSTS } from '../types/general'
import { EnvConfig } from '../conf/env_config'
import { IPost } from '../models/Post.model'

export const REDIS_STORE = {
  // get posts from cache
  getPosts: async (redisClient: Redis, cacheKey: string) => await redisClient?.get(cacheKey),

  // save posts into cache
  savePosts: async (redisClient: Redis, results: IPAGENATED_POSTS, cacheKey: string) =>
    await redisClient?.setex(cacheKey, EnvConfig.REDIS_CACHE_POSTS_EXPIRATION_SEC, JSON.stringify(results)),

  // save single post into cache
  saveSinglePost: async (redisClient: Redis, post: IPost | any, cacheKey: string) =>
    await redisClient?.setex(cacheKey, EnvConfig.REDIS_CACHE_SINGLE_POST_EXPIRATION_SEC, JSON.stringify(post)),
}
