const jwt = require('jsonwebtoken');

const EXPIRES_IN = '12h';

function getSecret() {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error('JWT_SECRET não configurado');
    }

    return secret;
}

/* Assina um JWT contendo o id e e-mail do usuário */
function assinar(usuario) {
    return jwt.sign(
        { sub: usuario.id, email: usuario.email },
        getSecret(),
        { expiresIn: EXPIRES_IN },
    );
}

/* Verifica e decodifica um JWT — lança se inválido/expirado */
function verificar(token) {
    return jwt.verify(token, getSecret());
}

module.exports = { assinar, verificar };
