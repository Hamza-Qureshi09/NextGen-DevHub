"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAuthorController = exports.addAuthorController = void 0;
const authorService_1 = require("../services/authorService");
const addAuthorController = async (req, res, _next) => {
    try {
        const { name } = req.body;
        const author = await (0, authorService_1.addAuthor)({ name });
        res.status(201).json({ author });
        return;
    }
    catch (error) {
        res.status(400).json({ error: error?.message });
        return;
    }
};
exports.addAuthorController = addAuthorController;
const deleteAuthorController = async (req, res, _next) => {
    try {
        const authorId = parseInt(req?.params?.id) || 0;
        const author = await (0, authorService_1.deleteAuthor)(authorId);
        res.status(200).json({ author });
        return;
    }
    catch (error) {
        res.status(400).json({ error: error?.message });
        return;
    }
};
exports.deleteAuthorController = deleteAuthorController;
//# sourceMappingURL=authorController.js.map