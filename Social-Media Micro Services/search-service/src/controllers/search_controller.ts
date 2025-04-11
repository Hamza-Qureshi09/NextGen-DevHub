import AppError from "../utils/app_error";
import { NextFunction, Request, Response } from "express";
import catchAsyncErrors from "../middlewares/catchAsyncErrors";
import SearchModel from "../models/Search.model";
import { Responces } from "../utils/responses";
import logger from "../utils/logger";

export const SearchPostController = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info("[1.] Start Searching for post...");

      const query = req.query.query as string;
      if (!query) {
        res.status(Responces.NOT_FOUND).json({ message: "query not found" });
        return;
      }
      const posts = await SearchModel.find(
        {
          $text: { $search: query },
        },
        {
          $score: { $meta: "testScore" },
        }
      )
        .sort({ score: { $meta: "testScore" } })
        .limit(10)
        .populate("author", "username")
        .exec();

      logger.info(`[2.] Found ${posts.length} post(s) for query "${query}"`);

      res.status(Responces.SUCCESS).json({
        success: true,
        data: posts,
      });

      return;
    } catch (error: any) {
      res.status(Responces.BAD_REQUEST).json({
        success: false,
        message: error.message || "Error while searching post",
      });
      return;
    }
  }
);
