import { NextFunction, Request, Response, RequestHandler } from 'express';
import logger from '../utils/logger';

const catchAsyncErrors = (theFunc: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(theFunc(req, res, next)).catch((error: Error) => {
    logger.error(error);
    next(error);
    return;
  });
};
export default catchAsyncErrors;
