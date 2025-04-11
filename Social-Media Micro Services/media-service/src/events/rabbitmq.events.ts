import logger from '../utils/logger'
import MediaModel from '../models/Media.model'
import { deleteMediaFromCloudinary } from '../utils/cloudinary'
import { stringIdToObjectId } from '../helpers/general.helper'
import { EXCHANGE_NAMES, RABBITMQ_EVENTS } from '../constants/general.constants'
import { publishEvent } from '../services/publisher.rabbitmq'

export const PostEventHandler = (msg: any, routingKey: string) => {
  switch (routingKey) {
    case 'post:deleted':
      PostDeleteEventHandler(msg)
      break
    case 'rqst:populated_media':
      PopulatedMediaEventRqstHandler(msg)
      break
    default:
      logger.warn(`❌ Unhandled event type: ${routingKey}`)
  }
}

// 1. post delete event handler
export const PostDeleteEventHandler = async (message: any) => {
  try {
    logger.info('✅ Post Deleted Event Received', message)
    const { postId, userId, mediaIds } = message

    const mediaIdsObjectIds = mediaIds?.length ? mediaIds.map((val: string) => stringIdToObjectId(val)) : []

    const mediaToDelete = await MediaModel.find({ _id: { $in: mediaIdsObjectIds } })
      .select('publicId userId')
      .lean()
      .exec()

    if (!mediaToDelete?.length) {
      logger.warn(`⚠️ No media found for post: ${postId}`)
      return
    }

    for (const media of mediaToDelete) {
      await Promise.all([deleteMediaFromCloudinary(media?.publicId), MediaModel.deleteOne({ _id: media?._id })])

      logger.info(` ✅ Media ${media?._id} deleted successfully associated with this post ${postId}`)
    }

    logger.info(`📌 Media deletion process completed for post: ${postId}`)
  } catch (error) {
    logger.error('❌ Error occurred during media deletion:', error)
    return
  }
}

// 1. populated media requests (single/all posts)
export const PopulatedMediaEventRqstHandler = async (message: any) => {
  try {
    logger.info('✅ Populated Media Event Received')

    if (message?.eventSubType === 'single_post') {
      const { mediaIds, requestId } = message
      const media =
        (await MediaModel.find({ _id: { $in: mediaIds } })
          .select('secure_url url mimeType')
          .lean()
          .exec()) || []

      // Publish populated media response for single post
      await publishEvent(EXCHANGE_NAMES.MEDIA_EVENTS, RABBITMQ_EVENTS.RESP_POPULATED_MEDIA, {
        eventSubType: 'single_post',
        data: {
          requestId,
          media,
        },
      })
    } else if (message?.eventSubType === 'all_posts') {
      const { rawPosts, requestId } = message
      const getAllMediaIds = rawPosts?.flatMap((p: any) => p?.mediaIds) || []
      const media =
        (await MediaModel.find({ _id: { $in: getAllMediaIds } })
          .select('secure_url url mimeType')
          .lean()
          .exec()) || []

      // Publish populated media response for all posts
      await publishEvent(EXCHANGE_NAMES.MEDIA_EVENTS, RABBITMQ_EVENTS.RESP_POPULATED_MEDIA, {
        eventSubType: 'all_posts',
        data: {
          requestId,
          media,
        },
      })
    } else {
      logger.warn('❌ Invalid event subtype: ', message?.eventSubType)
    }
  } catch (error) {
    logger.error('❌ Error occurred while processing media population:', error)
    // here i can publish error events to notify services
    return null
  }
}
