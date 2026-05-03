/**
 * Lê parametros, body e querys
 * Chama os servicos corretos
 * Define status HTTP
 * Não contem regras de negócio
 * Não se comunica com Prisma
 */

const andamentoService = require('../services/andamentoService');

const andamentoController = {
    async store(req, res, next) {
        try {
            const { processoId } = req.params;
            const resultado = await andamentoService.criar(processoId, req.body);
            return res.status(201).json(resultado);
        } catch (error) {
            return next(error);
        }
    },

    async update(req, res, next) {
        try {
            const { id } = req.params;

            const resultado = await andamentoService.atualizar(id, req.body);

            return res.status(200).json(resultado);
        } catch (error) {
            return next(error);
        }
    },

    async destroy(req, res, next) {
        try {
            const { id } = req.params;

            const resultado = await andamentoService.remover(id);

            return res.status(200).json(resultado);
        } catch (error) {
            return next(error);
        }
    },
};

module.exports = andamentoController;
