import { PrismaClient } from "../generated/prisma";
import { ADDBOOK, UPDATEBOOK } from "../types/general";
const prisma = new PrismaClient();

async function addBookService(params: ADDBOOK) {
  const { title = "", publishedDate = "", authorId = 0 } = params;
  try {
    const newBook = await prisma.book.create({
      data: {
        title,
        publishedDate,
        author: {
          connect: {
            id: authorId,
          },
        },
      },
      include: { author: true }, //once data created get author obj back
    });

    return newBook;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// get all books
async function getAllBooksService() {
  try {
    const books = await prisma.book.findMany({
      select: {
        title: true,
        id: true,
        author: { select: { name: true, id: true } },
      },
    });
    return books;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// get book by id
async function getBookByIdService(id: number) {
  try {
    const singleBook = await prisma.book.findUnique({
      where: {
        id: id,
      },
      select: {
        title: true,
        author: { select: { name: true } },
      },
    });
    if (!singleBook) {
      throw new Error(`Book with id ${id} not found!`);
    }
    return singleBook;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// update book
async function updateBookService({ id, newTitle }: UPDATEBOOK) {
  try {
    const findBook = await getBookByIdService(id);
    if (!findBook) {
      throw new Error(`Book with id ${id} not found!`);
    }
    // const updatedBook = await prisma.book.update({
    //   where: {
    //     id,
    //   },
    //   data: {
    //     title: newTitle,
    //   },
    //   include: { author: true },
    // });
    // return updatedBook;

    // using transactions gives (atomicity)
    const updatedBookTrans = await prisma.$transaction(async (prisma) => {
      const book = await prisma.book.findUnique({ where: { id } });
      if (!book) {
        throw new Error(`Book with id ${id} not found!`);
      }

      return prisma.book.update({
        where: { id },
        data: {
          title: newTitle,
        },
        include: {
          author: true,
        },
      });
    });

    return updatedBookTrans;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// delete book
async function deleteBookService(id: number) {
  try {
    const deletedBook = await prisma.$transaction(async (tx) => {
      const book = await tx.book.findUnique({ where: { id } });
      if (!book) {
        throw new Error(`Book with id ${id} not found!`);
      }

      return tx.book.delete({
        where: { id },
        include: { author: true },
      });
    });
    return deletedBook;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export {
  addBookService,
  getAllBooksService,
  getBookByIdService,
  updateBookService,
  deleteBookService,
};
