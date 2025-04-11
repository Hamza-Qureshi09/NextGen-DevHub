import jwt, { JwtPayload } from 'jsonwebtoken'
import { Responces, Messages } from '../utils/responses'
import { EnvConfig } from '../conf/env_config'

interface VerifyRefreshTokenResponse {
  newAccessToken?: string
  newRefreshToken?: string
  success?: boolean
  error?: {
    message: string
    status: number
  }
  userInfo?: {
    userId: string
  }
}
export const verifyRefreshToken = async (token: string): Promise<VerifyRefreshTokenResponse> => {
  try {
    const refreshToken = token?.split('_hhq_')[1]
    if (!refreshToken) {
      return { error: { message: 'Invalid refresh token format.', status: Responces.FORBIDDEN } }
    }
    const decodedToken = jwt.decode(refreshToken, {
      complete: true, // include the header and payload in the returned object
      json: true,
    })

    const verifyToken = jwt.verify(refreshToken, EnvConfig.JWT_SECRET)
    // not valid token
    if (!verifyToken) {
      return {
        error: {
          message: 'Refresh Token is not valid!',
          status: Responces.FORBIDDEN,
        },
      }
    }

    // Ensure `decodedToken` is not null and its payload is of type `JwtPayload`
    if (decodedToken && typeof decodedToken.payload !== 'string' && typeof decodedToken.payload.exp === 'number') {
      const currentTimestamp = Math.floor(Date.now() / 1000) // Convert to seconds
      if (decodedToken.payload.exp < currentTimestamp) {
        return {
          error: {
            message: 'Token is expired! Sign-in to access the resource.',
            status: Responces.FORBIDDEN,
          },
        }
      }
      if (decodedToken?.payload?.userId) {
        // success
        return {
          success: true,
          userInfo: {
            userId: decodedToken?.payload?.userId,
          },
        }
      }
    }
    return {
      error: {
        message: 'Invalid refresh token. Please sign in again.',
        status: Responces.FORBIDDEN,
      },
    }
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return {
        error: {
          message: 'Your session has expired. Please log in again.',
          status: Responces.FORBIDDEN,
        },
      }
    }
    return {
      error: {
        message: error.message,
        status: Responces.BAD_REQUEST,
      },
    }
  }
}
