import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { IUser } from '../models/User.model';
import { EnvConfig } from '../config/env.config';
import AppError from './app_errors';
import { Responces } from './responses';
import logger from './logger';
// import RefreshToken from '../models/RefreshToken.model';

export interface TokenPayload {
  userId: string;
  username?: string;
}

export const GenerateAccessToken = (user: IUser) => {
  try {
    const payload: TokenPayload = {
      userId: user._id!.toString(),
    };
    if (user.username) {
      payload.username = user.username;
    }
    return jwt.sign(payload, EnvConfig.JWT_SECRET, {
      algorithm: 'HS384',
      expiresIn: parseInt(EnvConfig.JWT_EXPIRES_IN),
    });
  } catch (error) {
    logger.info('JWT signing error:', error);
    throw new AppError({ message: 'Failed to generate token', status: Responces.BAD_REQUEST });
  }
};
// export const GenerateRefreshToken = async (user: IUser) => {
//   try {
//     const refreshToken = crypto.randomBytes(40).toString('hex');
//     const expiresAt = new Date();
//     expiresAt.setDate(expiresAt.getDate() + 7); // refresh token expires in 7 days

//     // find if user session already exists
//     const findSession = await RefreshToken.findOne({ user: user?._id }).lean().exec();
//     if (!findSession) {
//       await RefreshToken.create({
//         token: refreshToken,
//         user: user?._id,
//         expiresAt,
//       });
//     }

//     return refreshToken;
//   } catch (error) {
//     console.error('JWT signing error:', error);
//     throw new AppError({ message: 'Failed to generate token', status: Responces.BAD_REQUEST });
//   }
// };
