import express, { Request, Response } from "express";
import { SearchPostController } from "../controllers/search_controller";
import authenticatRequest from "../middlewares/auth.mdlw";
import { searchPostLimiter } from "../middlewares/RRL/search.limiter";
const router = express.Router();

// middleware -> this will tell if the user is authenticated or not.
router.use(authenticatRequest);

// routes
router.get("/search-post", searchPostLimiter, SearchPostController);

router.get("/sensitive", searchPostLimiter, (req: Request, res: Response) => {
  console.info(req.user, "user data");
  res.status(200).json({ msg: "PING very sensitive IS route!" });
  return;
});

export default router;
