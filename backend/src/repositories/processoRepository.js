/**
 * Conversa com o Prisma
 * Faz findMany, findUnique, create, update, delete
 * Não conhece HTTP
 * Não retorna res.status
 * */

const prisma = require('../database/prismaClient');

const processoRepository = {

    /* Buscar todos */
    findAll() {
        return prisma.processos.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                andamentos: {
                    orderBy: { data: 'desc' },
                },
            },
        });
    },

    /* Buscar por ID */
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

    /* Buscar por número do processo */
    findByNumeroProcesso(numeroProcesso) {
        return prisma.processos.findUnique({
            where: { numeroProcesso },
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
