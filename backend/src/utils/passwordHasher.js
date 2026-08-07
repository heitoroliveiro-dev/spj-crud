const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 12;

/* Gera o hash da senha em texto puro */
function hash(senha) {
    return bcrypt.hash(senha, SALT_ROUNDS);
}

/* Compara senha em texto puro com o hash salvo */
function compare(senha, senhaHash) {
    return bcrypt.compare(senha, senhaHash);
}

module.exports = { hash, compare };
