import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User.model';
import { Responces } from '../utils/responses';
import AppError from '../utils/app_errors';
import { EnvConfig } from '../config/env.config';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.cookies && req.cookies.access) {
    const accessToken = req.cookies.access;
    token = accessToken ? accessToken.split('_hhq_')[1] : '';
  }

  if (!token) {
    res.status(Responces.UNAUTHORIZED).json({
      message: 'Not authorized, no token',
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, EnvConfig.JWT_SECRET as string) as { userId: string };
    const user = await UserModel.findById(decoded.userId).select('-password');

    if (!user) {
      res.status(Responces.UNAUTHORIZED).json({
        message: 'Not authorized, user not found',
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(Responces.UNAUTHORIZED).json({
      message: 'Not authorized, invalid token',
    });
    return;
  }
};

export const verifyRfrsT = async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.cookies && req.cookies.rfrs) {
    const rfrsToken = req.cookies.rfrs;
    token = rfrsToken ? rfrsToken.split('_hhq_')[1] : '';
  }

  if (!token) {
    res.status(Responces.UNAUTHORIZED).json({
      message: 'Must Login',
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, EnvConfig.JWT_SECRET) as { userId: string };
    const user = await UserModel.findById(decoded.userId).select('-password');

    if (!user) {
      res.status(Responces.UNAUTHORIZED).json({
        message: 'Must Login',
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(Responces.UNAUTHORIZED).json({
      message: 'Must Login',
    });
    return;
  }
};
