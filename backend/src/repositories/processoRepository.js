/**
 * Conversa com o Prisma
 * Faz findMany, findUnique, create, update, delete
 * Não conhece HTTP
 * Não retorna res.status
 * */

const prisma = require('../database/prismaClient');

const processoRepository = {

    /* Buscar todos de um usuário */
    findAll(userId) {
        return prisma.processos.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                andamentos: {
                    orderBy: { data: 'desc' },
                },
            },
        });
    },

    /* Buscar por ID — sem filtro de dono aqui; a verificação de posse é feita no service */
    findById(id) {
        return prisma.processos.findUnique({
            where: { id },
            include: {
                andamentos: {
                    orderBy: { data: 'desc' }
                }
            }
        });
    },

    /* Buscar por número do processo, dentro dos processos de um usuário */
    findByNumeroProcesso(numeroProcesso, userId) {
        return prisma.processos.findUnique({
            where: { numeroProcesso_userId: { numeroProcesso, userId } },
        });
    },

    /* Criar novo */
    create(data) {
        return prisma.processos.create({ data });
    },

    /* Atualizar */
    update(id, data) {
        return prisma.processos.update({
            where: { id },
            data,
        });
    },

    /* Deletar */
    delete(id) {
        return prisma.processos.delete({
            where: { id },
        });
    },
};

module.exports = processoRepository;
