"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBookController = exports.updateBookController = exports.getBookByIdController = exports.getAllBooksController = exports.addBookController = void 0;
const bookService_1 = require("../services/bookService");
// add books
const addBookController = async (req, res, _next) => {
    try {
        const { title, authorId, publishedDate } = req.body;
        const book = await (0, bookService_1.addBookService)({
            title,
            authorId,
            publishedDate: new Date(publishedDate),
        });
        res.status(201).json(book);
        return;
    }
    catch (error) {
        res.status(400).json({ error: error?.message });
        return;
    }
};
exports.addBookController = addBookController;
// get books
const getAllBooksController = async (req, res, _next) => {
    try {
        const books = await (0, bookService_1.getAllBooksService)();
        res.status(200).json(books);
        return;
    }
    catch (error) {
        res.status(400).json({ error: error?.message });
        return;
    }
};
exports.getAllBooksController = getAllBooksController;
// get book by id
const getBookByIdController = async (req, res, _next) => {
    try {
        const bookId = parseInt(req?.params.id) || 0;
        const singleBook = await (0, bookService_1.getBookByIdService)(bookId);
        if (!singleBook) {
            res.status(404).json({ msg: "not found" });
            return;
        }
        res.status(200).json(singleBook);
        return;
    }
    catch (error) {
        res.status(400).json({ error: error?.message });
        return;
    }
};
exports.getBookByIdController = getBookByIdController;
// update book
const updateBookController = async (req, res, _next) => {
    try {
        const bookId = parseInt(req?.params.id) || 0;
        const { newTitle } = req.body;
        const updateBook = await (0, bookService_1.updateBookService)({ id: bookId, newTitle });
        res.status(200).json(updateBook);
        return;
    }
    catch (error) {
        res.status(400).json({ error: error?.message });
        return;
    }
};
exports.updateBookController = updateBookController;
// delete book
const deleteBookController = async (req, res, _next) => {
    try {
        const bookId = parseInt(req?.params.id) || 0;
        const deleteBook = await (0, bookService_1.deleteBookService)(bookId);
        res.status(200).json(deleteBook);
        return;
    }
    catch (error) {
        res.status(400).json({ error: error?.message });
        return;
    }
};
exports.deleteBookController = deleteBookController;
//# sourceMappingURL=bookController.js.map