import logger from '../../utils/logger';
import catchAsyncErrors from '../../middlewares/catch_async_errors.mdlw';
import { validateLogin, validateRegistration } from '../../utils/validations';
import AppError from '../../utils/app_errors';
import { NextFunction, Request, Response } from 'express';
import { Responces } from '../../utils/responses';
import UserModel, { IUser } from '../../models/User.model';
import { GenerateAccessToken, TokenPayload } from '../../utils/tokens';
import cookieService from '../../utils/cookies';
import { EnvConfig } from '../../config/env.config';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// user registration
const RegisterUserController = catchAsyncErrors(async (req: Request, res: Response, _next: NextFunction) => {
  try {
    logger.info('Registration starts...');
    // validate the schema
    const { error, value } = validateRegistration(req.body);
    if (error) {
      res.status(Responces.INCOMPLETE_INFORMATION).json({ message: error.message });
      return;
    }

    const { username, email, password } = req.body as IUser;
    let user = await UserModel.findOne({ email });
    if (user) {
      logger.error('User Already Exist!');
      res.status(Responces.FORBIDDEN).json({ message: 'User Already Exist!' });
      return;
    }
    let payload: Record<string, string | boolean> = {
      username,
      email,
      password,
    };
    if (req.body.isSuperAdmin) {
      payload.isSuperAdmin = true;
    }
    // create user
    user = new UserModel(payload);
    await user.save();
    logger.info(`User (${user?._id}) Created Successfully!`);

    // do further work here like tokens in db-TTL or in Redis-TTL
    // generate tokens here
    const token = GenerateAccessToken(user, EnvConfig.JWT_EXPIRES_IN);
    const rftoken = GenerateAccessToken(user, EnvConfig.JWT_REXPIRES_IN);
    // here return tokens in cookies or in headers
    cookieService(
      'access',
      `_hhq_${token}`,
      {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 1000 * 60 * Number(EnvConfig.ACCESS_COOKIE_EXPIRE)), //for next 10min
        sameSite: 'none', //lax
      },
      res
    );
    cookieService(
      'rfrs',
      `_hhq_${rftoken}`,
      {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 1000 * 60 * Number(EnvConfig.REFRESH_COOKIE_EXPIRE)), //for next 10min
        sameSite: 'none', //lax
      },
      res
    );
    // success response
    res.status(Responces.CREATED).json({ message: 'User Created Successfully!' });
    return;
  } catch (error: any) {
    res.status(Responces.BAD_REQUEST).json(error);
    return;
  }
});

// user login
const LoginUserController = catchAsyncErrors(async (req: Request, res: Response, _next: NextFunction) => {
  try {
    // validate the schema
    const { error, value } = validateLogin(req.body);
    if (error) {
      res.status(Responces.INCOMPLETE_INFORMATION).json({ message: error.message });
      return;
    }

    const { email, password } = req.body;

    const user = await UserModel.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password, user.password))) {
      throw new AppError({ message: 'Details are invalid!', status: Responces.FORBIDDEN });
    }

    const token = GenerateAccessToken(user, EnvConfig.JWT_EXPIRES_IN);
    const rftoken = GenerateAccessToken(user, EnvConfig.JWT_REXPIRES_IN);
    // here return tokens in cookies or in headers
    cookieService(
      'access',
      `_hhq_${token}`,
      {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 1000 * 60 * Number(EnvConfig.ACCESS_COOKIE_EXPIRE)), //for next 10min
        sameSite: 'none', //lax
      },
      res
    );
    cookieService(
      'rfrs',
      `_hhq_${rftoken}`,
      {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 1000 * 60 * Number(EnvConfig.REFRESH_COOKIE_EXPIRE)), //for next 10min
        sameSite: 'none', //lax
      },
      res
    );

    res.json({
      _id: user._id,
      name: user.username,
      email: user.email,
      token,
    });
    return;
  } catch (error: any) {
    throw new AppError({
      message: error.message,
      status: Responces.BAD_REQUEST,
    });
  }
});

// refresh token
const RefreshTokenUserController = catchAsyncErrors(async (req: Request, res: Response, _next: NextFunction) => {
  const user = req.user;

  try {
    const token = GenerateAccessToken(user, EnvConfig.JWT_EXPIRES_IN);
    // here return tokens in cookies or in headers
    cookieService(
      'access',
      `_hhq_${token}`,
      {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 1000 * 60 * Number(EnvConfig.ACCESS_COOKIE_EXPIRE)), //for next 10min
        sameSite: 'none', //lax
      },
      res
    );

    res.json({ message: 'Token refreshed' });
  } catch (error: any) {
    throw new AppError({
      message: error.message,
      status: Responces.BAD_REQUEST,
    });
  }
});

// verify me
const verifyMe = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    res.status(Responces.SUCCESS).json({
      _id: req.user._id,
      name: req.user.username,
      email: req.user.email,
    });
    return;
  } catch (error: any) {
    throw new AppError({
      message: error.message,
      status: Responces.BAD_REQUEST,
    });
  }
};

// logout
const LogoutUserController = catchAsyncErrors(async (req: Request, res: Response, _next: NextFunction) => {
  try {
    res.clearCookie('access');
    res.clearCookie('rfrs');
    res.status(200).json({ message: 'Logged out successfully' });
    return;
  } catch (error: any) {
    throw new AppError({
      message: error.message,
      status: Responces.BAD_REQUEST,
    });
  }
});

// forget psw
const forgetPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(Responces.NOT_FOUND).json({ message: 'User not found' });
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    // In a real app, send resetToken via email
    res.status(Responces.SUCCESS).json({ resetToken });
    return;
  } catch (error: any) {
    throw new AppError({
      message: error.message,
      status: Responces.BAD_REQUEST,
    });
  }
};

// reset psw
const resetPassword = async (req: Request, res: Response) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await UserModel.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });
    if (!user) {
      res.status(Responces.NOT_FOUND).json({ message: 'Invalid or expired token' });
      return;
    }

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    const token = GenerateAccessToken(user, EnvConfig.JWT_EXPIRES_IN);
    const rftoken = GenerateAccessToken(user, EnvConfig.JWT_REXPIRES_IN);
    // here return tokens in cookies or in headers
    cookieService(
      'access',
      `_hhq_${token}`,
      {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 1000 * 60 * Number(EnvConfig.ACCESS_COOKIE_EXPIRE)), //for next 10min
        sameSite: 'none', //lax
      },
      res
    );
    cookieService(
      'rfrs',
      `_hhq_${rftoken}`,
      {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 1000 * 60 * Number(EnvConfig.REFRESH_COOKIE_EXPIRE)), //for next 10min
        sameSite: 'none', //lax
      },
      res
    );

    res.status(200).json({ message: 'Password reset successful' });
    return;
  } catch (error: any) {
    throw new AppError({
      message: error.message,
      status: Responces.BAD_REQUEST,
    });
  }
};

// change psw
const changePassword = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findById(req.user._id).select('password');
    const pswComparison = await user.comparePassword(req.body.currentPassword, user.password, req.body.currentPassword);

    if (!user || !pswComparison) {
      res.status(Responces.BAD_REQUEST).json({ message: 'Invalid current password' });
      return;
    }

    user.password = req.body.newPassword;
    await user.save();

    const token = GenerateAccessToken(user, EnvConfig.JWT_EXPIRES_IN);
    const rftoken = GenerateAccessToken(user, EnvConfig.JWT_REXPIRES_IN);
    // here return tokens in cookies or in headers
    cookieService(
      'access',
      `_hhq_${token}`,
      {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 1000 * 60 * Number(EnvConfig.ACCESS_COOKIE_EXPIRE)), //for next 10min
        sameSite: 'none', //lax
      },
      res
    );
    cookieService(
      'rfrs',
      `_hhq_${rftoken}`,
      {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 1000 * 60 * Number(EnvConfig.REFRESH_COOKIE_EXPIRE)), //for next 10min
        sameSite: 'none', //lax
      },
      res
    );

    res.status(200).json({ message: 'Password changed successfully' });
    return;
  } catch (error: any) {
    throw new AppError({
      message: error.message,
      status: Responces.BAD_REQUEST,
    });
  }
};

export {
  RegisterUserController,
  LoginUserController,
  RefreshTokenUserController,
  LogoutUserController,
  forgetPassword,
  changePassword,
  resetPassword,
  verifyMe,
};
