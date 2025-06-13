import { PrismaClient } from "../generated/prisma";
import { ADDAUTHOR } from "../types/general";
const prisma = new PrismaClient();

async function addAuthor(params: ADDAUTHOR) {
  const { name = "" } = params;
  try {
    const newAuthor = await prisma.author.create({
      data: {
        name,
      },
    });

    return newAuthor;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function deleteAuthor(id: number) {
  try {
    const deleteAuthorAndItsBooks = await prisma.author.delete({
      where: {
        id,
      },
      include: { books: true }, // will delete all related books
    });

    return deleteAuthorAndItsBooks;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export { addAuthor, deleteAuthor };
