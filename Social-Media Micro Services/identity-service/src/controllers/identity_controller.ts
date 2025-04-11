import logger from '../utils/logger'
import catchAsyncErrors from '../middlewares/catchAsyncErrors'
import { validateLogin, validateRegistration } from '../utils/validation'
import AppError from '../utils/app_error'
import { NextFunction, Request, Response } from 'express'
import { Messages, Responces } from '../utils/responses'
import UserModel, { IUser } from '../models/User.model'
import { GenerateAccessToken, GenerateRefreshToken } from '../utils/tokens'
import cookieService from '../utils/cookies'
import { EnvConfig } from '../conf/env_config'
import { comparePassword } from '../helpers/general.helper'
import { verifyRefreshToken } from '../services/vrfrt'

// user registration
const RegisterUserController = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('Registration starts...')
    // validate the schema
    const { error } = validateRegistration(req.body)
    if (error) {
      logger.warn('Validation Error', error)
      return next(
        new AppError({
          message: error.message,
          status: Responces.INCOMPLETE_INFORMATION,
        }),
      )
    }
    const { username, email, password } = req.body as IUser

    let user = await UserModel.findOne({ $or: [{ email }, { username }] })
    if (user) {
      logger.warn('User Already Exist!')
      throw new AppError({ message: 'User Already Exist!', status: Responces.FORBIDDEN })
    }

    // create user
    user = new UserModel({
      username,
      email,
      password,
    })
    await user.save()
    logger.info(`User (${user?._id}) Created Successfully!`)

    // generate tokens
    const accessToken = GenerateAccessToken(user)
    const refreshToken = GenerateRefreshToken(user)

    // here return tokens in cookies or in headers
    cookieService(
      'access',
      `_hhq_${accessToken}`,
      {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 1000 * 60 * Number(EnvConfig.ACCESS_COOKIE_EXPIRE)), //for next 10min
        sameSite: 'none', //lax
      },
      res,
    )
    cookieService(
      'rfrs',
      `_hhq_${accessToken}`,
      {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 1000 * 60 * Number(EnvConfig.REFRESH_COOKIE_EXPIRE)), //for next 10min
        sameSite: 'none', //lax
      },
      res,
    )

    // success response
    res.status(Responces.CREATED).json({ message: 'User Created Successfully!', accessToken, refreshToken })
    return
  } catch (error: any) {
    throw new AppError({
      message: error.message,
      status: Responces.BAD_REQUEST,
    })
  }
})

// user login
const LoginUserController = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Fields validation
    const { error } = validateLogin(req.body)
    if (error) {
      logger.warn('Validation Error', error)
      return next(new AppError({ message: error.message, status: Responces.INCOMPLETE_INFORMATION }))
    }
    const { useremail, userpassword } = req.body

    // find user based on email
    let user = await UserModel.findOne({ $or: [{ email: useremail }] }).select('+password role username')
    if (!user) {
      return next(new AppError({ message: 'User Not Exist!', status: Responces.NOT_FOUND }))
    }

    // compare password
    const isMatch = await comparePassword(user?.password, userpassword as string)
    if (!isMatch) {
      res.status(Responces.FORBIDDEN).json({ message: 'Invalid Password!', status: Responces.FORBIDDEN, success: false })
      return
    }

    const accessToken = GenerateAccessToken(user)
    const refToken = GenerateRefreshToken(user)

    // saving cookies
    cookieService(
      'access',
      `_hhq_${accessToken}`,
      {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 1000 * 60 * Number(EnvConfig.ACCESS_COOKIE_EXPIRE)),
        sameSite: 'none', //lax
      },
      res,
    )
    cookieService(
      'rfrs',
      `_hhq_${refToken}`,
      {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 1000 * 60 * Number(EnvConfig.REFRESH_COOKIE_EXPIRE)),
        sameSite: 'none', //lax
      },
      res,
    )

    // success response
    res.status(Responces.SUCCESS).json({
      message: 'User Logged-In Successfully!',
      success: true,
      user: {
        email: user.email,
        status: user?.status,
        _id: user?._id,
      },
      accessToken,
      refToken,
    })
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

// refresh token
const RefreshTokenUserController = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { rfrs } = req.cookies
    if (!rfrs) {
      return next(
        new AppError({
          message: `Could not refresh access token.`,
          status: Responces.UNAUTHORIZED,
        }),
      )
    }

    // validate ref token & generate ref token
    const response = await verifyRefreshToken(rfrs)
    if (response.error) {
      const { error } = response
      return next(
        new AppError({
          message: error.message,
          status: error.status,
        }),
      )
    }
    // generate new access & refresh tokens
    const { userInfo, success } = response
    if (!success || !userInfo) {
      return next(
        new AppError({
          message: Messages.BAD_REQUEST,
          status: Responces.CONFLICT_ERROR,
        }),
      )
    }
    // get user session
    const userSession = await UserModel.findOne({ _id: userInfo?.userId }).select('_id username role')

    if (!userSession) {
      return next(
        new AppError({
          message: 'Session expired! Sign-in again.',
          status: Responces.FORBIDDEN,
        }),
      )
    }
    const newAccessToken = GenerateAccessToken(userSession)

    // here return tokens in cookies or in headers
    cookieService(
      'access',
      `_hhq_${newAccessToken}`,
      {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 1000 * 60 * Number(EnvConfig.ACCESS_COOKIE_EXPIRE)),
        sameSite: 'none', //lax
      },
      res,
    )

    // success response
    res.status(Responces.SUCCESS).json({ newAccessToken })
  } catch (error: any) {
    throw new AppError({
      message: error.message,
      status: Responces.BAD_REQUEST,
    })
  }
})

// logout
const LogoutUserController = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    // const { rfrs } = req.cookies
    // const user = req.userInfo
    // if (!rfrs) {
    //   return next(
    //     new AppError({
    //       message: `Refresh token is missing.`,
    //       status: Responces.BAD_REQUEST,
    //     }),
    //   )
    // }

    // delete cookies
    res.clearCookie('access')
    res.clearCookie('rfrs')
    // success response
    res.status(Responces.SUCCESS).json({ message: 'User Logout Successfully' })
  } catch (error: any) {
    throw new AppError({
      message: error.message,
      status: Responces.BAD_REQUEST,
    })
  }
})

// my info /me
const MyInfoController = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.userInfo
    // logger.info(user)

    res.status(Responces.SUCCESS).json({
      success: Messages.SUCCESS,
      user: user,
    })
  } catch (error: any) {
    return next(
      new AppError({
        message: error.message,
        status: Responces.BAD_REQUEST,
      }),
    )
  }
})

export { RegisterUserController, LoginUserController, RefreshTokenUserController, LogoutUserController, MyInfoController }
