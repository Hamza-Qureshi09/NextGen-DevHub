import { Router } from "express";
import {
  addAuthorController,
  deleteAuthorController,
} from "../controllers/authorController";

const router = Router();

router.post("/add-author", addAuthorController);
router.delete("/delete/:id", deleteAuthorController);

const authorRoutes = router;
export { authorRoutes };
