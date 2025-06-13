"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addAuthor = addAuthor;
exports.deleteAuthor = deleteAuthor;
const prisma_1 = require("../generated/prisma");
const prisma = new prisma_1.PrismaClient();
async function addAuthor(params) {
    const { name = "" } = params;
    try {
        const newAuthor = await prisma.author.create({
            data: {
                name,
            },
        });
        return newAuthor;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
async function deleteAuthor(id) {
    try {
        const deleteAuthorAndItsBooks = await prisma.author.delete({
            where: {
                id,
            },
            include: { books: true }, // will delete all related books
        });
        return deleteAuthorAndItsBooks;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
//# sourceMappingURL=authorService.js.map