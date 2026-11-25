/*
 * Spec 002 (modo demonstração): com DEMO_MODE=true, rotas que dependem de e-mail (cadastro e
 * redefinição de senha) ficam indisponíveis — a demonstração não tem provedor de e-mail. Sem
 * DEMO_MODE, passa direto e nada muda.
 */
function demoGuard(req, res, next) {
    if (process.env.DEMO_MODE === 'true') {
        return res.status(403).json({ error: 'Indisponível na demonstração' });
    }
    return next();
}

module.exports = demoGuard;
