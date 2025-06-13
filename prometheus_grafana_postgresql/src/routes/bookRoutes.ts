import { Router } from "express";
import {
  addBookController,
  getAllBooksController,
  getBookByIdController,
  updateBookController,
  deleteBookController,
} from "../controllers/bookController";

const router = Router();

router.post("/add-book", addBookController);
router.get("/all-books", getAllBooksController);
router.get("/book/:id", getBookByIdController);
router.put("/book/:id", updateBookController);
router.delete("/book/:id", deleteBookController);

const bookRoutes = router;
export { bookRoutes };
