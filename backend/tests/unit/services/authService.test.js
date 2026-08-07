// Objetivo: testar regras de negócio de auth sem banco/e-mail reais.
// Repositórios e emailService são falsos, então é possível controlar o cenário.

const authService = require('../../../src/services/authService');
const userRepository = require('../../../src/repositories/userRepository');
const emailVerificationTokenRepository = require('../../../src/repositories/emailVerificationTokenRepository');
const passwordResetTokenRepository = require('../../../src/repositories/passwordResetTokenRepository');
const emailService = require('../../../src/services/emailService');
const passwordHasher = require('../../../src/utils/passwordHasher');

jest.mock('../../../src/repositories/userRepository');
jest.mock('../../../src/repositories/emailVerificationTokenRepository');
jest.mock('../../../src/repositories/passwordResetTokenRepository');
jest.mock('../../../src/services/emailService');

describe('authService.signup', () => {
    test('lança erro 400 para e-mail inválido', async () => {
        await expect(
            authService.signup({ email: 'invalido', senha: '12345678' })
        ).rejects.toMatchObject({ status: 400 });
    });

    test('lança erro 400 para senha curta', async () => {
        await expect(
            authService.signup({ email: 'a@a.com', senha: '123' })
        ).rejects.toMatchObject({ status: 400 });
    });

    test('lança erro 409 quando e-mail já cadastrado', async () => {
        userRepository.findByEmail.mockResolvedValue({ id: 1 });

        await expect(
            authService.signup({ email: 'a@a.com', senha: '12345678' })
        ).rejects.toMatchObject({ status: 409 });
    });

    test('cria usuário, gera token e envia e-mail de verificação', async () => {
        userRepository.findByEmail.mockResolvedValue(null);
        userRepository.create.mockResolvedValue({ id: 1, email: 'a@a.com' });

        const result = await authService.signup({ email: 'a@a.com', senha: '12345678' });

        expect(userRepository.create).toHaveBeenCalledWith(
            expect.objectContaining({ email: 'a@a.com' })
        );
        expect(emailVerificationTokenRepository.create).toHaveBeenCalledWith(
            expect.objectContaining({ userId: 1 })
        );
        expect(emailService.enviarEmailVerificacao).toHaveBeenCalledWith('a@a.com', expect.any(String));
        expect(result.message).toMatch(/confirmar/);
    });
});

describe('authService.verifyEmail', () => {
    test('lança erro 400 para token inexistente', async () => {
        emailVerificationTokenRepository.findByTokenHash.mockResolvedValue(null);

        await expect(authService.verifyEmail('token-invalido')).rejects.toMatchObject({ status: 400 });
    });

    test('lança erro 400 para token já usado', async () => {
        emailVerificationTokenRepository.findByTokenHash.mockResolvedValue({
            id: 1,
            userId: 1,
            usedAt: new Date(),
            expiresAt: new Date(Date.now() + 100000),
        });

        await expect(authService.verifyEmail('token')).rejects.toMatchObject({ status: 400 });
    });

    test('lança erro 400 para token expirado', async () => {
        emailVerificationTokenRepository.findByTokenHash.mockResolvedValue({
            id: 1,
            userId: 1,
            usedAt: null,
            expiresAt: new Date(Date.now() - 1000),
        });

        await expect(authService.verifyEmail('token')).rejects.toMatchObject({ status: 400 });
    });

    test('confirma e-mail com token válido', async () => {
        emailVerificationTokenRepository.findByTokenHash.mockResolvedValue({
            id: 1,
            userId: 1,
            usedAt: null,
            expiresAt: new Date(Date.now() + 100000),
        });

        const result = await authService.verifyEmail('token-valido');

        expect(userRepository.markEmailVerified).toHaveBeenCalledWith(1);
        expect(emailVerificationTokenRepository.markUsed).toHaveBeenCalledWith(1);
        expect(result.message).toBe('E-mail confirmado com sucesso.');
    });
});

describe('authService.login', () => {
    test('lança erro 401 genérico quando usuário não existe', async () => {
        userRepository.findByEmail.mockResolvedValue(null);

        await expect(
            authService.login({ email: 'naoexiste@a.com', senha: '12345678' })
        ).rejects.toMatchObject({ status: 401, message: 'E-mail ou senha inválidos' });
    });

    test('lança erro 401 genérico quando senha está errada', async () => {
        userRepository.findByEmail.mockResolvedValue({
            id: 1,
            email: 'a@a.com',
            passwordHash: await passwordHasher.hash('senhacorreta'),
            emailVerifiedAt: new Date(),
        });

        await expect(
            authService.login({ email: 'a@a.com', senha: 'senhaerrada' })
        ).rejects.toMatchObject({ status: 401, message: 'E-mail ou senha inválidos' });
    });

    test('lança erro 403 quando e-mail não foi confirmado', async () => {
        userRepository.findByEmail.mockResolvedValue({
            id: 1,
            email: 'a@a.com',
            passwordHash: await passwordHasher.hash('12345678'),
            emailVerifiedAt: null,
        });

        await expect(
            authService.login({ email: 'a@a.com', senha: '12345678' })
        ).rejects.toMatchObject({ status: 403 });
    });

    test('retorna token e usuário com credenciais corretas e e-mail confirmado', async () => {
        process.env.JWT_SECRET = 'segredo-de-teste';
        userRepository.findByEmail.mockResolvedValue({
            id: 1,
            email: 'a@a.com',
            nome: 'Fulano',
            passwordHash: await passwordHasher.hash('12345678'),
            emailVerifiedAt: new Date(),
        });

        const result = await authService.login({ email: 'a@a.com', senha: '12345678' });

        expect(result.token).toEqual(expect.any(String));
        expect(result.user).toEqual({ id: 1, email: 'a@a.com', nome: 'Fulano' });
    });
});

describe('authService.forgotPassword', () => {
    test('responde com mensagem genérica mesmo se o e-mail não existir', async () => {
        userRepository.findByEmail.mockResolvedValue(null);

        const result = await authService.forgotPassword({ email: 'naoexiste@a.com' });

        expect(passwordResetTokenRepository.create).not.toHaveBeenCalled();
        expect(result.message).toMatch(/Se este e-mail estiver cadastrado/);
    });

    test('gera token e envia e-mail quando o e-mail existe', async () => {
        userRepository.findByEmail.mockResolvedValue({ id: 1, email: 'a@a.com' });

        const result = await authService.forgotPassword({ email: 'a@a.com' });

        expect(passwordResetTokenRepository.create).toHaveBeenCalledWith(
            expect.objectContaining({ userId: 1 })
        );
        expect(emailService.enviarEmailRedefinicaoSenha).toHaveBeenCalledWith('a@a.com', expect.any(String));
        expect(result.message).toMatch(/Se este e-mail estiver cadastrado/);
    });
});

describe('authService.resetPassword', () => {
    test('lança erro 400 para senha curta', async () => {
        await expect(
            authService.resetPassword({ token: 'token', novaSenha: '123' })
        ).rejects.toMatchObject({ status: 400 });
    });

    test('lança erro 400 para token inválido ou expirado', async () => {
        passwordResetTokenRepository.findByTokenHash.mockResolvedValue(null);

        await expect(
            authService.resetPassword({ token: 'token', novaSenha: '12345678' })
        ).rejects.toMatchObject({ status: 400 });
    });

    test('redefine a senha com token válido', async () => {
        passwordResetTokenRepository.findByTokenHash.mockResolvedValue({
            id: 1,
            userId: 1,
            usedAt: null,
            expiresAt: new Date(Date.now() + 100000),
        });

        const result = await authService.resetPassword({ token: 'token-valido', novaSenha: '12345678' });

        expect(userRepository.updatePassword).toHaveBeenCalledWith(1, expect.any(String));
        expect(passwordResetTokenRepository.markUsed).toHaveBeenCalledWith(1);
        expect(result.message).toBe('Senha redefinida com sucesso.');
    });
});
