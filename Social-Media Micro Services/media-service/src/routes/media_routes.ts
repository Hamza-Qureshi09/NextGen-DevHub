import express, { Request, Response, NextFunction } from "express";
import authenticatRequest from "../middlewares/auth.mdlw";
import {
  DeleteMediaController,
  GetAllMediaController,
  uploadMedia,
} from "../controllers/media_controller";
import { multerMiddleware } from "../middlewares/multer.mdlw";
const router = express.Router();

// middleware -> this will tell if the user is authenticated or not.
router.use(authenticatRequest);

router.post("/upload", multerMiddleware, uploadMedia);
router.get("/get-media", GetAllMediaController);
router.delete("/delete-media", DeleteMediaController);

export default router;
