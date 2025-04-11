import logger from '../utils/logger'
import catchAsyncErrors from '../middlewares/catchAsyncErrors'
import { validatePost } from '../utils/validation'
import AppError from '../utils/app_error'
import { NextFunction, Request, Response } from 'express'
import { Responces } from '../utils/responses'
import { EnvConfig } from '../conf/env_config'
import PostModel, { IPost } from '../models/Post.model'
import { REDIS_STORE } from '../redis/redis.actions'
import Redis from 'ioredis'
import { IPAGENATED_POSTS } from '../types/general'
import { invalidatePostCache, SINGLE_POST_KEY, NEW_POST_KEY } from '../helpers/general.helper'
import { EXCHANGE_NAMES, RABBITMQ_EVENTS, REDIS_RQST_RESP_CYCLE } from '../constants/general.constants'
import { publishEvent } from '../services/publisher.rabbitmq'
import { waitForResponse } from '../utils/redis_req_res_'
import { v4 as uuidv4 } from 'uuid'

// create post
const CreatePostController = catchAsyncErrors(async (req: Request, res: Response, _next: NextFunction) => {
  try {
    // validate the schema
    const { error } = validatePost(req.body)
    if (error) {
      logger.warn('Validation Error', error)
      res.status(Responces.INCOMPLETE_INFORMATION).json({
        success: false,
        message: error.message || '',
      })
      return
    }

    const { content, mediaIds } = req.body as IPost
    if (!req.user) throw new Error('User info not available')
    const userId = req.user?.userId

    // create new post
    const post = new PostModel({
      user: userId,
      content,
      mediaIds: mediaIds || [],
    })
    await post.save()

    // publish event for search service ->
    await publishEvent(EXCHANGE_NAMES.POST_EVENTS, RABBITMQ_EVENTS.POST_CREATED, {
      postId: post?._id?.toString() || '',
      userId: post?.user?.toString() || '',
      content: post?.content || '',
    })

    // success response
    logger.info('Post saved successfully')
    await invalidatePostCache(req, post?._id?.toString())
    res.status(Responces.CREATED).json({
      success: true,
      message: 'Post Created Successfully!',
    })
    return
  } catch (error: any) {
    res.status(Responces.BAD_REQUEST).json({
      success: false,
      message: error.message || '',
    })
    return
  }
})

// get all posts
const GetAllPostController = catchAsyncErrors(async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const page = Math.max(parseInt(req.query.page as string) || 1, 1)
    const limit = parseInt(req.query.limit as string) || 10
    const startIndex = (page - 1) * limit
    const redisClient = req.redisClient as Redis

    // get posts from redis cache
    const cacheKey = NEW_POST_KEY(page, limit)
    const cachedPosts = await REDIS_STORE.getPosts(redisClient, cacheKey)

    // results from cached posts
    if (cachedPosts) {
      logger.info('Posts Returned from Cache')
      res.status(Responces.SUCCESS).json({ data: JSON.parse(cachedPosts) })
      return
    }

    // Fetch data from DB
    const [rawPosts, totalNoOfPosts] = await Promise.all([
      PostModel.find({}).select('user content mediaIds createdAt').sort({ createdAt: -1 }).skip(startIndex).limit(limit).lean<IPost[]>().exec() || [],
      PostModel.countDocuments().exec(),
    ])

    // 1. Generate Unique Request ID
    const requestId = uuidv4()
    // 2. Store Request ID in Redis with Expiry (10s timeout)
    await redisClient.setex(`${REDIS_RQST_RESP_CYCLE.MEDIA_REQ_}${requestId}`, EnvConfig.REDIS_RQST_RESP_CYCLE_EXPIRE_TIME, 'pending')

    // 3. publishing populated media rqst for media service ->
    await publishEvent(EXCHANGE_NAMES.POST_EVENTS, RABBITMQ_EVENTS.RQST_POPULATED_MEDIA, {
      eventSubType: 'all_posts',
      rawPosts: rawPosts,
      requestId,
    })

    // 4. Waiting for response OR timeout after 10 seconds
    const mediaResponse = (await waitForResponse(requestId, REDIS_RQST_RESP_CYCLE.MEDIA_RESP_, EnvConfig.RQST_RESP_TIME_OUT)) || []

    // 5. Creating a map to quickly lookup media by their _id
    const mediaMap = mediaResponse.reduce((map: any, media: any) => {
      map[media._id] = media
      return map
    }, {})
    const modifiedResponse = rawPosts?.map((post) => {
      const populatedMediaForPost = post?.mediaIds?.map((id) => mediaMap[id]) || []

      return {
        ...post,
        media: populatedMediaForPost,
      }
    })

    // paginated results
    const results: IPAGENATED_POSTS = {
      posts: modifiedResponse || [],
      currentPage: page || 0,
      totalPosts: totalNoOfPosts || 0,
      totalPages: totalNoOfPosts > 0 ? Math.ceil(totalNoOfPosts / limit) : 1,
    }

    // save posts into redis cache
    await REDIS_STORE.savePosts(redisClient, results, cacheKey)

    logger.info('Posts Returned from DB')
    res.status(Responces.SUCCESS).json({ data: results })
    return
  } catch (error: any) {
    logger.error('Error fetching posts', error)
    res.status(Responces.BAD_REQUEST).json({
      success: false,
      message: error.message || '',
    })
    return
  }
})

// get single post
const GetPostController = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const redisClient = req.redisClient as Redis
    const postId = req.query.id as string
    if (!postId) {
      res.status(Responces.NOT_FOUND).json({ message: 'postId not found' })
      return
    }

    // get post from redis cache
    const cacheKey = SINGLE_POST_KEY(postId)
    const cachedPost = await REDIS_STORE.getPosts(redisClient, cacheKey)

    // results from cached posts
    if (cachedPost) {
      logger.info('Post Returned from Cache')
      const post = JSON.parse(cachedPost)
      res.status(Responces.SUCCESS).json({ data: post })
      return
    }

    // Get post data from DB
    const singlePost = await PostModel.findOne({ _id: postId }).select('user content mediaIds createdAt').lean<IPost>().exec()
    if (!singlePost) {
      res.status(Responces.NOT_FOUND).json({ message: 'Post not found' })
      return
    }

    // 1. Generate Unique Request ID
    const requestId = uuidv4()
    // 2. Store Request ID in Redis with Expiry (10s timeout)
    await redisClient.setex(`${REDIS_RQST_RESP_CYCLE.MEDIA_REQ_}${requestId}`, EnvConfig.REDIS_RQST_RESP_CYCLE_EXPIRE_TIME, 'pending')

    // 3. publish populated media rqst for media service ->
    await publishEvent(EXCHANGE_NAMES.POST_EVENTS, RABBITMQ_EVENTS.RQST_POPULATED_MEDIA, {
      eventSubType: 'single_post',
      mediaIds: singlePost?.mediaIds,
      requestId,
    })

    // 4. Wait for response OR timeout after 10 seconds
    const mediaResponse = (await waitForResponse(requestId, REDIS_RQST_RESP_CYCLE.MEDIA_RESP_, EnvConfig.RQST_RESP_TIME_OUT)) || []
    const modifiedResponse = {
      ...singlePost,
      media: mediaResponse ?? [],
    }

    // 5. save into cache
    await REDIS_STORE.saveSinglePost(redisClient, modifiedResponse, cacheKey)

    // ✅ Return response with populated media
    logger.info('Post Returned from DB')
    res.status(Responces.SUCCESS).json({ post: modifiedResponse })
    return
  } catch (error: any) {
    return next(
      new AppError({
        message: error.message,
        status: Responces.BAD_REQUEST,
      }),
    )
  }
})

// delete single post
const DeletePostController = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.userId
    const postId = req.query.id as string
    if (!postId) {
      res.status(Responces.NOT_FOUND).json({ message: 'postId not found' })
      return
    }

    const post = await PostModel.findOneAndDelete({
      _id: postId,
      user: userId,
    })

    if (!post) {
      res.status(Responces.NOT_FOUND).json({ message: 'post not found' })
      return
    }

    // publish post delete event for media and search service ->
    await publishEvent(EXCHANGE_NAMES.POST_EVENTS, RABBITMQ_EVENTS.POST_DELETED, {
      postId: post?._id?.toString() || '',
      userId: userId || '',
      mediaIds: post?.mediaIds || [],
    })

    await invalidatePostCache(req, postId)
    // success
    logger.info('Post Deleted successfully')
    res.status(Responces.SUCCESS).json({ message: 'Post Deleted successfully' })
    return
  } catch (error: any) {
    return next(
      new AppError({
        message: error.message,
        status: Responces.BAD_REQUEST,
      }),
    )
  }
})

export { CreatePostController, GetAllPostController, GetPostController, DeletePostController }
