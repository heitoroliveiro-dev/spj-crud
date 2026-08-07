const crypto = require('node:crypto');

/* Gera um token aleatório (enviado por e-mail) e o hash dele (guardado no banco) */
function gerarToken() {
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = hashToken(token);
    return { token, tokenHash };
}

/* Hasheia um token recebido (ex.: vindo da URL) para comparar com o que está no banco */
function hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
}

module.exports = { gerarToken, hashToken };
