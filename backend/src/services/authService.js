const userRepository = require('../repositories/userRepository');
const emailVerificationTokenRepository = require('../repositories/emailVerificationTokenRepository');
const passwordResetTokenRepository = require('../repositories/passwordResetTokenRepository');
const emailService = require('./emailService');
const passwordHasher = require('../utils/passwordHasher');
const { gerarToken, hashToken } = require('../utils/tokenGenerator');
const jwt = require('../utils/jwt');

const EMAIL_VERIFICATION_HORAS = 24;
const PASSWORD_RESET_HORAS = 24;
const SENHA_MIN_LENGTH = 8;

function reportaErro(message, status = 400) {
    const error = new Error(message);
    error.status = status;
    throw error;
}

function daquiAHoras(horas) {
    return new Date(Date.now() + horas * 60 * 60 * 1000);
}

function normalizaEmail(email) {
    return String(email || '').trim().toLowerCase();
}

function validarEmail(email) {
    const regexEmailSimples = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !regexEmailSimples.test(email)) {
        throw reportaErro('E-mail inválido', 400);
    }
}

function validarSenha(senha) {
    if (!senha || String(senha).length < SENHA_MIN_LENGTH) {
        throw reportaErro(`Senha deve ter pelo menos ${SENHA_MIN_LENGTH} caracteres`, 400);
    }
}

function usuarioPublico(user) {
    return { id: user.id, email: user.email, nome: user.nome };
}

const authService = {

    /* CADASTRO */
    async signup(payload) {
        const email = normalizaEmail(payload.email);
        validarEmail(email);
        validarSenha(payload.senha);

        const usuarioExistente = await userRepository.findByEmail(email);

        if (usuarioExistente) {
            throw reportaErro('Este e-mail já está cadastrado', 409);
        }

        const passwordHash = await passwordHasher.hash(payload.senha);
        const user = await userRepository.create({
            email,
            passwordHash,
            nome: payload.nome || null,
        });

        const { token, tokenHash } = gerarToken();
        await emailVerificationTokenRepository.create({
            tokenHash,
            userId: user.id,
            expiresAt: daquiAHoras(EMAIL_VERIFICATION_HORAS),
        });

        await emailService.enviarEmailVerificacao(user.email, token);

        return {
            message: 'Cadastro realizado. Confira seu e-mail para confirmar a conta antes de entrar.',
        };
    },

    /* VERIFICAÇÃO DE E-MAIL */
    async verifyEmail(token) {
        if (!token) {
            throw reportaErro('Token inválido ou expirado', 400);
        }

        const registro = await emailVerificationTokenRepository.findByTokenHash(hashToken(token));

        if (!registro || registro.usedAt || registro.expiresAt < new Date()) {
            throw reportaErro('Token inválido ou expirado', 400);
        }

        await userRepository.markEmailVerified(registro.userId);
        await emailVerificationTokenRepository.markUsed(registro.id);

        return { message: 'E-mail confirmado com sucesso.' };
    },

    /* LOGIN */
    async login(payload) {
        const email = normalizaEmail(payload.email);
        const user = await userRepository.findByEmail(email);

        const credencialInvalida = () => reportaErro('E-mail ou senha inválidos', 401);

        if (!user) {
            credencialInvalida();
        }

        const senhaCorreta = await passwordHasher.compare(payload.senha || '', user.passwordHash);

        if (!senhaCorreta) {
            credencialInvalida();
        }

        if (!user.emailVerifiedAt) {
            throw reportaErro('Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.', 403);
        }

        const token = jwt.assinar(user);

        return { token, user: usuarioPublico(user) };
    },

    /* PEDIDO DE REDEFINIÇÃO DE SENHA */
    async forgotPassword(payload) {
        const email = normalizaEmail(payload.email);
        const user = await userRepository.findByEmail(email);

        if (user) {
            const { token, tokenHash } = gerarToken();
            await passwordResetTokenRepository.create({
                tokenHash,
                userId: user.id,
                expiresAt: daquiAHoras(PASSWORD_RESET_HORAS),
            });

            await emailService.enviarEmailRedefinicaoSenha(user.email, token);
        }

        /* Mesma resposta exista ou não o e-mail — nunca revelar se a conta existe */
        return {
            message: 'Se este e-mail estiver cadastrado, enviamos um link de redefinição de senha.',
        };
    },

    /* REDEFINIÇÃO DE SENHA */
    async resetPassword(payload) {
        const { token } = payload;
        validarSenha(payload.novaSenha);

        if (!token) {
            throw reportaErro('Token inválido ou expirado', 400);
        }

        const registro = await passwordResetTokenRepository.findByTokenHash(hashToken(token));

        if (!registro || registro.usedAt || registro.expiresAt < new Date()) {
            throw reportaErro('Token inválido ou expirado', 400);
        }

        const passwordHash = await passwordHasher.hash(payload.novaSenha);
        await userRepository.updatePassword(registro.userId, passwordHash);
        await passwordResetTokenRepository.markUsed(registro.id);

        return { message: 'Senha redefinida com sucesso.' };
    },
};

module.exports = authService;
