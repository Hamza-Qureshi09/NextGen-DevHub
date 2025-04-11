import fs from 'node:fs'
import { NextFunction, Request, Response } from 'express'
import catchAsyncErrors from '../middlewares/catchAsyncErrors'
import logger from '../utils/logger'
import { Responces } from '../utils/responses'
import { uploadMediaToCloudinary } from '../utils/cloudinary'
import { UploadApiResponse } from 'cloudinary'
import MediaModel, { IMedia } from '../models/Media.model'

// upload media
const uploadMedia = catchAsyncErrors(async (req: Request, res: Response, _next: NextFunction) => {
  try {
    if (!req?.files || req?.files.length === 0) {
      res.status(Responces.BAD_REQUEST).json({
        success: false,
        message: 'No files found. Please add files and try again!',
      })
      return
    }

    const files = req.files as Express.Multer.File[]
    const userId = req?.user?.userId || ''
    logger.info(`Uploading ${files.length} files...`)

    // 💥 MULTIPLE FILES UPLOADER & MULTER USE multer.diskStorage() (ROM)
    const uploadResults = await Promise.all(
      files.map(async (file) => {
        try {
          logger.info(`Uploading file: ${file?.originalname}, Size: ${file?.size}`)

          if (!file?.path || file?.size === 0) {
            throw new Error(`File ${file.originalname} is empty or missing!`)
          }

          // upload to cloudinary
          const result: UploadApiResponse = await uploadMediaToCloudinary(file, 'ROM_Memory')

          // save in DB
          const newlyCreatedMedia = await MediaModel.create({
            publicId: result?.public_id || '',
            userId,
            originalName: file?.originalname || '',
            mimeType: file?.mimetype || '',
            url: result?.url || 'not_found',
            secure_url: result?.secure_url || 'not_found',
          })

          // Delete the local file after upload
          if (fs.existsSync(file?.path)) {
            fs.unlinkSync(file.path)
          }

          return {
            fileName: file?.originalname,
            secureUrl: result?.secure_url,
            mediaId: newlyCreatedMedia?._id,
          }
        } catch (error: any) {
          logger.error(`Error uploading file ${file?.originalname}:`, error.message)
          return { fileName: file?.originalname, error: error.message }
        }
      }),
    )

    // 💥 SINGLE FILE UPLOADER & MULTER USE  multer.memoryStorage() (RAM)
    logger.info('Media saved successfully')
    res.status(Responces.CREATED).json({
      success: true,
      message: 'Files uploaded successfully!',
      files: uploadResults,
    })
    return
  } catch (error: any) {
    logger.info('Error creating media')
    res.status(Responces.BAD_REQUEST).json({
      success: false,
      message: error.message || '',
    })
    return
  }
})

// get all medias
const GetAllMediaController = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allmedias = await MediaModel.find({}).sort({ createdAt: -1 }).lean<IMedia[]>().exec()

    // success
    logger.info('Media Returned from DB')
    res.status(Responces.SUCCESS).json({ data: allmedias })
    return
  } catch (error: any) {
    logger.error('Error fetching media', error)
    res.status(Responces.BAD_REQUEST).json({
      success: false,
      message: error.message || '',
    })
    return
  }
})

// delete media
const DeleteMediaController = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allmedias = await MediaModel.find({}).sort({ createdAt: -1 }).lean<IMedia[]>().exec()

    // success
    logger.info('Media Returned from DB')
    res.status(Responces.SUCCESS).json({ data: allmedias })
    return
  } catch (error: any) {
    logger.error('Error fetching media', error)
    res.status(Responces.BAD_REQUEST).json({
      success: false,
      message: error.message || '',
    })
    return
  }
})

export { uploadMedia, GetAllMediaController, DeleteMediaController }
