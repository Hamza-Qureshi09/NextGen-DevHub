import multer from "multer";
import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
import { Responces } from "../utils/responses";
import { ensureFolderExists } from "../helpers/general.helper";
import {
  MAX_UPLOAD_FILES,
  UPLOADS_FOLDER,
} from "../constants/general.constants";
import { EnvConfig } from "../conf/env_config";

// ensure folder exists always
ensureFolderExists();

// 📂 Configuring Disk Storage
const storage = multer.diskStorage({
  destination: UPLOADS_FOLDER,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// ✅ Multer Middleware
export const upload = multer({
  storage: storage, //multer.memoryStorage(), 👉 // Stores file in RAM if using cloudinary & single file upload method from multer
  limits: {
    fileSize: EnvConfig.FILE_MAX_TOTAL_SIZE,
  },
}).array("files", MAX_UPLOAD_FILES); //.single("file"); 👉 // .single allow to upload one file at a time

// ✅ Middleware for handling file uploads & errors
export const multerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        logger.error(
          `File upload error: Too many files selected. Max allowed: ${MAX_UPLOAD_FILES}, Selected: ${
            req.files?.length || "unknown"
          }`
        );
        return res.status(Responces.BAD_REQUEST).json({
          success: false,
          message: `You have selected too many files. The maximum allowed is ${MAX_UPLOAD_FILES}.`,
        });
      } else {
        logger.error("Multer error while uploading:", err);
        return res.status(Responces.BAD_REQUEST).json({
          success: false,
          message: "Multer error while uploading.",
          error: err.message,
        });
      }
    } else if (err) {
      logger.error("Unknown error occurred while uploading:", err);
      return res.status(Responces.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Unknown error occurred while uploading.",
      });
    } else if (
      !req.files ||
      (req.files as Express.Multer.File[])?.length === 0
    ) {
      logger.error("No files Found!");
      return res.status(Responces.NOT_FOUND).json({
        success: false,
        message: "No files found!",
      });
    }

    const totalSize = (req.files as Express.Multer.File[]).reduce(
      (sum, file) => sum + file.size,
      0
    );
    if (totalSize > EnvConfig.FILE_MAX_TOTAL_SIZE) {
      return res.status(Responces.BAD_REQUEST).json({
        success: false,
        message: "You can upload max 5MB of resource at a time.",
      });
    }
    next();
  });
};
