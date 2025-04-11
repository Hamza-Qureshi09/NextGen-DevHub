import logger from '../utils/logger'
import SearchModel from '../models/Search.model'
import { validatePost } from '../utils/validation'

export const PostEventHandler = (msg: any, routingKey: string) => {
  switch (routingKey) {
    case 'post:created':
      PostCreateEventHandler(msg)
      break

    case 'post:deleted':
      PostDeleteEventHandler(msg)
      break
    default:
      logger.warn(`❌ Unhandled event type: ${routingKey}`)
  }
}

// 1. post-search rec create event handler
export const PostCreateEventHandler = async (message: any) => {
  try {
    logger.info('✅ Post-Search Create Event Received', message)
    const { postId, userId, content } = message

    // validate the schema
    const { error } = validatePost(message)
    if (error) {
      logger.warn(`Validation Error for post-search: ${postId}`, error)
      // handle the case where tha failed event stored in global failed events
      logger.error(`Validation Error for post-search: ${postId}`, error)
      return
    }

    // create new post
    const searchPostRec = new SearchModel({
      userId: userId,
      postId: postId,
      content: content,
    })
    await searchPostRec.save()

    // success
    logger.info(`✅ Post-Search creation process completed for post: ${postId}`)
  } catch (error) {
    logger.error('❌ Error occurred during post-search record creation:', error)
    return
  }
}

// 2. post delete event handler
export const PostDeleteEventHandler = async (message: any) => {
  try {
    logger.info('✅ Post Deleted Event Received', message)
    const { postId, ...payload } = message

    // delete search index
    await SearchModel.deleteMany({ postId: postId })

    logger.info(`📌 Post-Index deletion process completed for post: ${postId}`)
  } catch (error) {
    logger.error('❌ Error occurred during media deletion:', error)
    return
  }
}
