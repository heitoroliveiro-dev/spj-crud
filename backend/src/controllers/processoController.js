/**
 * Lê parametros, body e querys
 * Chama os servicos corretos
 * Define status HTTP
 * Não contem regras de negócio
 * Não se comunica com Prisma
 */

const processoService = require('../services/processoService');

const processoController = {
    /* GET    /api/processos        */
    async index(req, res, next){
        try {
            const processos = await processoService.listar();
            return res.status(200).json(processos);
        } catch (error){
            return next(error)
        }
    },

    /* GET    /api/processos/:id    */
    async show(req, res, next){
        try{
            const {id} = req.params;
            const processo = await processoService.buscarPorId(id);
            return res.status(200).json(processo);
        } catch (error){
            return next(error);
        }
    },    

    /* POST   /api/processos        */
    async store(req, res, next){
        try {
            const resultado = await processoService.novoProcesso(req.body);

            return res.status(201).json(resultado);
        } catch (error) {
            return next(error);
        }
    },

    /* PUT    /api/processos/:id    */
    async update(req, res, next){
        try {
            const {id} = req.params;

            const processo = await processoService.atualizarProcesso(id, req.body);

            return res.status(200).json(processo);
        } catch (error) {
            return next(error);
        }
    },    

    /* DELETE /api/processos/:id    */
    async destroy(req, res, next){
        try {
            const {id} = req.params;

            await processoService.removerProcesso(id);

            return res.status(200).json({
                message: 'Processo excluído com sucesso',
            })
        } catch (error) {
            return next(error);
        }
    },
};

module.exports = processoController;
