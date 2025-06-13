"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorRoutes = void 0;
const express_1 = require("express");
const authorController_1 = require("../controllers/authorController");
const router = (0, express_1.Router)();
router.post("/add-author", authorController_1.addAuthorController);
router.delete("/delete/:id", authorController_1.deleteAuthorController);
const authorRoutes = router;
exports.authorRoutes = authorRoutes;
//# sourceMappingURL=authorRoutes.js.map