/**
 * Único ponto que lê o JWT do header Authorization.
 * Popula req.user = { id, email } se válido, senão responde 401.
 */

const jwt = require('../utils/jwt');

function requireAuth(req, res, next) {
    const header = req.headers.authorization || '';
    const [tipo, token] = header.split(' ');

    if (tipo !== 'Bearer' || !token) {
        return res.status(401).json({ error: 'Não autenticado' });
    }

    try {
        const payload = jwt.verificar(token);
        req.user = { id: payload.sub, email: payload.email };
        return next();
    } catch (error) {
        return res.status(401).json({ error: 'Sessão inválida ou expirada' });
    }
}

module.exports = requireAuth;
