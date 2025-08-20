import logger from '../../utils/logger';
import catchAsyncErrors from '../../middlewares/catch_async_errors.mdlw';
import { validateLogin, validateRegistration } from '../../utils/validations';
import AppError from '../../utils/app_errors';
import { NextFunction, Request, Response } from 'express';
import { Responces } from '../../utils/responses';
import UserModel, { IUser } from '../../models/User.model';
import { GenerateAccessToken } from '../../utils/tokens';
import cookieService from '../../utils/cookies';
import { EnvConfig } from '../../config/env.config';

// user registration
const RegisterUserController = catchAsyncErrors(async (req: Request, res: Response, _next: NextFunction) => {
  try {
    // logger.info('Registration starts...');
    // // validate the schema
    // const { error } = validateRegistration(req.body);
    // if (error) {
    //   logger.warn('Validation Error', error);
    //   throw new AppError({ message: error.message, status: Responces.INCOMPLETE_INFORMATION }); // Throw the error
    // }
    // const { username, email, password } = req.body as IUser;
    // let user = await UserModel.findOne({ $or: [{ email }, { username }] });
    // if (user) {
    //   logger.warn('User Already Exist!');
    //   throw new AppError({ message: 'User Already Exist!', status: Responces.FORBIDDEN });
    // }
    // // create user
    // user = new UserModel({
    //   username,
    //   email,
    //   password,
    // });
    // await user.save();
    // logger.info(`User (${user?._id}) Created Successfully!`);
    // // do further work here like tokens in db-TTL or in Redis-TTL
    // // generate tokens here
    // // here return tokens in cookies or in headers
    // cookieService(
    //   'access',
    //   `_hhq_${accessToken}`,
    //   {
    //     httpOnly: true,
    //     secure: true,
    //     expires: new Date(Date.now() + 1000 * 60 * Number(EnvConfig.ACCESS_COOKIE_EXPIRE)), //for next 10min
    //     sameSite: 'none', //lax
    //   },
    //   res
    // );
    // cookieService(
    //   'rfrs',
    //   `_hhq_${accessToken}`,
    //   {
    //     httpOnly: true,
    //     secure: true,
    //     expires: new Date(Date.now() + 1000 * 60 * Number(EnvConfig.REFRESH_COOKIE_EXPIRE)), //for next 10min
    //     sameSite: 'none', //lax
    //   },
    //   res
    // );
    // // success response
    // res.status(Responces.CREATED).json({ message: 'User Created Successfully!' });
  } catch (error: any) {
    throw new AppError({
      message: error.message,
      status: Responces.BAD_REQUEST,
    });
  }
});

// user login
const LoginUserController = catchAsyncErrors(async (req: Request, res: Response, _next: NextFunction) => {
  try {
  } catch (error: any) {
    throw new AppError({
      message: error.message,
      status: Responces.BAD_REQUEST,
    });
  }
});

// refresh token
const RefreshTokenUserController = catchAsyncErrors(async (req: Request, res: Response, _next: NextFunction) => {
  try {
  } catch (error: any) {
    throw new AppError({
      message: error.message,
      status: Responces.BAD_REQUEST,
    });
  }
});

// logout
const LogoutUserController = catchAsyncErrors(async (req: Request, res: Response, _next: NextFunction) => {
  try {
  } catch (error: any) {
    throw new AppError({
      message: error.message,
      status: Responces.BAD_REQUEST,
    });
  }
});

export { RegisterUserController, LoginUserController, RefreshTokenUserController, LogoutUserController };
