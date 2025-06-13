"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookRoutes = void 0;
const express_1 = require("express");
const bookController_1 = require("../controllers/bookController");
const router = (0, express_1.Router)();
router.post("/add-book", bookController_1.addBookController);
router.get("/all-books", bookController_1.getAllBooksController);
router.get("/book/:id", bookController_1.getBookByIdController);
router.put("/book/:id", bookController_1.updateBookController);
router.delete("/book/:id", bookController_1.deleteBookController);
const bookRoutes = router;
exports.bookRoutes = bookRoutes;
//# sourceMappingURL=bookRoutes.js.map