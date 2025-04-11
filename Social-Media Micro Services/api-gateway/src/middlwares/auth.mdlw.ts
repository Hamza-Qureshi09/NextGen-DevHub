import { NextFunction, Request, Response } from 'express'
import AppError from '../utils/app_errors'
import jwt from 'jsonwebtoken'
import { Messages, Responces } from '../utils/responses'
import catchAsyncErrors from './catchAsyncErrors'
import { EnvConfig } from '../conf/env.config'
import logger from '../utils/logger'

export const validateToken = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    // bearer token way ✅
    // const authHeader = req.headers['authorization'] || ''
    // const token = authHeader && authHeader.split(' ')[1]

    // cookie based token
    const { access } = req.cookies
    // console.info(access)
    if (!access) {
      return next(new AppError({ message: 'Please Login to access this resource.', status: Responces.UNAUTHORIZED }))
    }
    const acsToken = access?.split('_hhq_')[1]
    if (!acsToken) {
      return next(new AppError({ message: 'Token not provided.', status: Responces.UNAUTHORIZED }))
    }

    //  check if token is valid
    jwt.verify(acsToken, EnvConfig.JWT_SECRET, (err: any, user: any) => {
      if (err) {
        logger.info(err?.message || 'Invalid token!')
        return next(
          new AppError({
            message: 'Invalid token!',
            status: Responces.UNAUTHORIZED,
          }),
        )
      }

      req.userInfo = user
      next()
    })
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.clearCookie('access')
      return next(
        new AppError({
          message: Messages.SESSION_EXPIRED,
          status: Responces.UNAUTHORIZED,
        }),
      )
    }
    return next(new AppError({ message: error.message, status: Responces.BAD_REQUEST }))
  }
})
