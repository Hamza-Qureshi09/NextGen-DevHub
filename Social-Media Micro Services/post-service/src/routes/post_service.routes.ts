import express, { Request, Response } from "express";
import {
  CreatePostController,
  DeletePostController,
  GetAllPostController,
  GetPostController,
} from "../controllers/post_controller";
import authenticatRequest from "../middlewares/auth.mdlw";
import {
  createPostLimiter,
  readPostLimiter,
} from "../middlewares/RRL/post.limiter";
const router = express.Router();

// middleware -> this will tell if the user is authenticated or not.
router.use(authenticatRequest);

// routes
router.post("/create-post", createPostLimiter, CreatePostController);
router.get("/all-posts", readPostLimiter, GetAllPostController);
router.get("/post", readPostLimiter, GetPostController);
router.delete("/post", readPostLimiter, DeletePostController);

router.get("/sensitive", readPostLimiter, (req: Request, res: Response) => {
  console.info(req.user, "user data");
  res.status(200).json({ msg: "PING very sensitive IS route!" });
  return;
});

export default router;
