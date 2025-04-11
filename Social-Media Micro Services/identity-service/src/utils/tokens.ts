import jwt from 'jsonwebtoken'
import { IUser } from '../models/User.model'
import { EnvConfig } from '../conf/env_config'
import AppError from './app_error'
import { Responces } from './responses'
import logger from './logger'
import { UserRoles } from '../types/general'

export interface TokenPayload {
  userId: string
  username?: string
  role?: UserRoles
}

export const GenerateAccessToken = (user: IUser) => {
  try {
    const payload: TokenPayload = {
      userId: user?._id?.toString(),
    }
    if (user.username) {
      payload.username = user.username
    }
    if (user.role) {
      payload.role = user.role
    }
    return jwt.sign(payload, EnvConfig.JWT_SECRET, {
      algorithm: 'HS384',
      expiresIn: '1h',
    })
  } catch (error) {
    logger.info('JWT signing error:', error)
    throw new AppError({ message: 'Failed to generate token', status: Responces.BAD_REQUEST })
  }
}
export const GenerateRefreshToken = (user: IUser) => {
  try {
    const payload: TokenPayload = {
      userId: user._id!.toString(),
    }
    if (user.username) {
      payload.username = user.username
    }
    if (user.role) {
      payload.role = user.role
    }
    return jwt.sign(payload, EnvConfig.JWT_SECRET, {
      algorithm: 'HS384',
      expiresIn: '7d',
    })
  } catch (error) {
    console.error('JWT signing error:', error)
    throw new AppError({ message: 'Failed to generate token', status: Responces.BAD_REQUEST })
  }
}
