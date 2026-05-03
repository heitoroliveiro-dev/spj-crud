/**
 * Conversa com o Prisma
 * Faz findMany, findUnique, create, update, delete
 * Não conhece HTTP
 * Não retorna res.status
 * */

const prisma = require('../database/prismaClient');

const andamentoRepository = {
    /* encontrar andamento pela id */
    findById(id) {
        return prisma.andamento.findUnique({
            where: { id },
        });
    },

    /* encontrar andamento pelo processo */
    findByProcessoId(processosId) {
        return prisma.andamento.findMany({
            where: { processosId },
            orderBy: { data: 'desc' }
        });
    },

    /* novo andamento */
    create(data) {
        return prisma.andamento.create({ data });
    },

    /* atualizar andamento */
    update (id, data) {
        return prisma.andamento.update({
            where: { id },
            data,
        });
    },

    /* excluir andamento */
    delete(id) {
        return prisma.andamento.delete({
            where: { id },
        });
    },
};

module.exports = andamentoRepository;
