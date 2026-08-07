/**
 * Conversa com o Prisma
 * Faz findMany, findUnique, create, update, delete
 * Não conhece HTTP
 * Não retorna res.status
 * */

const prisma = require('../database/prismaClient');

const userRepository = {
    /* buscar por e-mail */
    findByEmail(email) {
        return prisma.user.findUnique({
            where: { email },
        });
    },

    /* buscar por id */
    findById(id) {
        return prisma.user.findUnique({
            where: { id },
        });
    },

    /* criar novo usuário */
    create(data) {
        return prisma.user.create({ data });
    },

    /* marcar e-mail como verificado */
    markEmailVerified(id) {
        return prisma.user.update({
            where: { id },
            data: { emailVerifiedAt: new Date() },
        });
    },

    /* atualizar senha */
    updatePassword(id, passwordHash) {
        return prisma.user.update({
            where: { id },
            data: { passwordHash },
        });
    },
};

module.exports = userRepository;
