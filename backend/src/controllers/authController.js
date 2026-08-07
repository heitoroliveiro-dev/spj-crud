/**
 * Lê parametros, body e querys
 * Chama os servicos corretos
 * Define status HTTP
 * Não contem regras de negócio
 * Não se comunica com Prisma
 */

const authService = require('../services/authService');

const authController = {
    /* POST /api/auth/signup */
    async signup(req, res, next) {
        try {
            const resultado = await authService.signup(req.body);
            return res.status(201).json(resultado);
        } catch (error) {
            return next(error);
        }
    },

    /* POST /api/auth/verify-email */
    async verifyEmail(req, res, next) {
        try {
            const resultado = await authService.verifyEmail(req.body.token);
            return res.status(200).json(resultado);
        } catch (error) {
            return next(error);
        }
    },

    /* POST /api/auth/login */
    async login(req, res, next) {
        try {
            const resultado = await authService.login(req.body);
            return res.status(200).json(resultado);
        } catch (error) {
            return next(error);
        }
    },

    /* POST /api/auth/forgot-password */
    async forgotPassword(req, res, next) {
        try {
            const resultado = await authService.forgotPassword(req.body);
            return res.status(200).json(resultado);
        } catch (error) {
            return next(error);
        }
    },

    /* POST /api/auth/reset-password */
    async resetPassword(req, res, next) {
        try {
            const resultado = await authService.resetPassword(req.body);
            return res.status(200).json(resultado);
        } catch (error) {
            return next(error);
        }
    },
};

module.exports = authController;
