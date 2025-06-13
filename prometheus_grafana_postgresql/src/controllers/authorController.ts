import { Request, Response, NextFunction } from "express";
import { addAuthor, deleteAuthor } from "../services/authorService";

export const addAuthorController = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const { name } = req.body;
    const author = await addAuthor({ name });
    res.status(201).json({ author });
    return;
  } catch (error: any) {
    res.status(400).json({ error: error?.message });
    return;
  }
};

export const deleteAuthorController = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const authorId = parseInt(req?.params?.id) || 0;
    const author = await deleteAuthor(authorId);
    res.status(200).json({ author });
    return;
  } catch (error: any) {
    res.status(400).json({ error: error?.message });
    return;
  }
};
