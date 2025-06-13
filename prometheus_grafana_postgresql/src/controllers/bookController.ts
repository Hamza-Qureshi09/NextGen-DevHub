import { Request, Response, NextFunction } from "express";
import { addAuthor } from "../services/authorService";
import { ADDBOOK, UPDATEBOOK } from "../types/general";
import {
  addBookService,
  deleteBookService,
  getAllBooksService,
  getBookByIdService,
  updateBookService,
} from "../services/bookService";

// add books
export const addBookController = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const { title, authorId, publishedDate }: ADDBOOK = req.body;
    const book = await addBookService({
      title,
      authorId,
      publishedDate: new Date(publishedDate),
    });
    res.status(201).json(book);
    return;
  } catch (error: any) {
    res.status(400).json({ error: error?.message });
    return;
  }
};

// get books
export const getAllBooksController = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const books = await getAllBooksService();
    res.status(200).json(books);
    return;
  } catch (error: any) {
    res.status(400).json({ error: error?.message });
    return;
  }
};

// get book by id
export const getBookByIdController = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const bookId = parseInt(req?.params.id) || 0;
    const singleBook = await getBookByIdService(bookId);
    if (!singleBook) {
      res.status(404).json({ msg: "not found" });
      return;
    }
    res.status(200).json(singleBook);
    return;
  } catch (error: any) {
    res.status(400).json({ error: error?.message });
    return;
  }
};

// update book
export const updateBookController = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const bookId = parseInt(req?.params.id) || 0;
    const { newTitle }: UPDATEBOOK = req.body;
    const updateBook = await updateBookService({ id: bookId, newTitle });
    res.status(200).json(updateBook);
    return;
  } catch (error: any) {
    res.status(400).json({ error: error?.message });
    return;
  }
};

// delete book
export const deleteBookController = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const bookId = parseInt(req?.params.id) || 0;
    const deleteBook = await deleteBookService(bookId);
    res.status(200).json(deleteBook);
    return;
  } catch (error: any) {
    res.status(400).json({ error: error?.message });
    return;
  }
};
