import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";
import catchAsyncErrors from "./catchAsyncErrors";
import AppError from "../utils/app_error";
import { Responces } from "../utils/responses";

const authenticatRequest = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.headers["x-user-id"] as string;
      // console.info(userId, "userid");
      if (!userId) {
        logger.warn("Access attmpted without user ID.");
        return next(
          new AppError({
            message: "Authentication required! Please login to continue.",
            status: Responces.UNAUTHORIZED,
          })
        );
      }

      req.user = { userId };
      next();
    } catch (error: any) {
      return next(
        new AppError({
          message: error.message,
          status: Responces.BAD_REQUEST,
        })
      );
    }
  }
);

export default authenticatRequest;
