import catchAsyncErrors from './catchAsyncErrors'
import jwt from 'jsonwebtoken'
import { Responces, Messages } from '../utils/responses'
import UserModel from '../models/User.model'
import AppError from '../utils/app_error'
import { NextFunction, Request, Response } from 'express'
import { EnvConfig } from '../conf/env_config'

export const authenticateUser = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { access } = req.cookies
    // console.info('comming', access)

    // cookie exist or not
    if (!access) {
      return next(
        new AppError({
          message: 'Please Login to access this resource.',
          status: Responces.UNAUTHORIZED,
        }),
      )
    }

    const acsToken = access?.split('_hhq_')[1]
    const decodedToken = jwt.decode(acsToken, {
      complete: true, // include the header and payload in the returned object
      json: true,
    })

    const verifyToken = jwt.verify(acsToken, EnvConfig.JWT_SECRET)
    // not valid token
    if (!verifyToken) {
      return next(
        new AppError({
          message: 'Token is not valid',
          status: Responces.UNAUTHORIZED,
        }),
      )
    }

    // Ensure `decodedToken` is not null and its payload is of type `JwtPayload`
    if (decodedToken && typeof decodedToken.payload !== 'string' && typeof decodedToken.payload.exp === 'number') {
      const currentTimestamp = Math.floor(Date.now() / 1000) // Convert to seconds
      if (decodedToken.payload.exp < currentTimestamp) {
        return next(
          new AppError({
            message: 'Token is expired! Sign-in to access the resource.',
            status: Responces.UNAUTHORIZED,
          }),
        )
      }
      if (decodedToken?.payload?.userId) {
        // get user session
        const userSession = await UserModel.findOne({ _id: decodedToken?.payload?.userId }).select('_id username role email createdAt')
        if (!userSession) {
          res.clearCookie('access')
          return next(
            new AppError({
              message: 'Session is expired! Sign-in again to access the resourse.',
              status: Responces.UNAUTHORIZED,
            }),
          )
        }

        // success
        req.userInfo = userSession
        next()
        return
      }
    } else {
      // Handle cases where decodedToken is null or payload is not valid
      return next(
        new AppError({
          message: 'Invalid token. Please sign in again.',
          status: Responces.UNAUTHORIZED,
        }),
      )
    }

    return
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
    return next(
      new AppError({
        message: error.message,
        status: Responces.BAD_REQUEST,
      }),
    )
  }
})
