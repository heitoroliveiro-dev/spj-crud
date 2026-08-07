/**
 * Conversa com o Prisma
 * Faz findMany, findUnique, create, update, delete
 * Não conhece HTTP
 * Não retorna res.status
 * */

const prisma = require('../database/prismaClient');

const passwordResetTokenRepository = {
    /* criar novo token */
    create(data) {
        return prisma.passwordResetToken.create({ data });
    },

    /* buscar por hash do token, junto com o usuário dono */
    findByTokenHash(tokenHash) {
        return prisma.passwordResetToken.findUnique({
            where: { tokenHash },
            include: { user: true },
        });
    },

    /* marcar como usado */
    markUsed(id) {
        return prisma.passwordResetToken.update({
            where: { id },
            data: { usedAt: new Date() },
        });
    },
};

module.exports = passwordResetTokenRepository;
