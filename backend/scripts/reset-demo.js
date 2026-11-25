/*
 * Spec 002 — reset diário da demonstração. Apaga todos os dados e recria a conta de demonstração
 * (e-mail já verificado) e uma carteira de processos fictícios. Só roda com DEMO_MODE=true, para
 * nunca apagar um banco que não seja o da demonstração. Sem SQL cru: só Prisma.
 *   docker compose exec -T backend node scripts/reset-demo.js
 */
const prisma = require('../src/database/prismaClient');
const passwordHasher = require('../src/utils/passwordHasher');

const PROCESSOS = [
    ['5001234-56.2026.8.13.0024', 'Ação de cobrança de aluguéis atrasados', 'Imobiliária Exemplo Ltda', 'Dra. Ana Demonstração', 'MG', 210, [[200, 'Petição inicial protocolada'], [150, 'Citação do réu'], [60, 'Audiência de conciliação sem acordo']]],
    ['0800123-45.2026.8.26.0100', 'Indenização por danos materiais em obra', 'Construtora Modelo S.A.', 'Dr. Bruno Fictício', 'SP', 180, [[170, 'Distribuição'], [90, 'Contestação apresentada']]],
    ['1000456-78.2026.8.19.0001', 'Revisão de contrato de financiamento', 'Carlos Exemplo', 'Dra. Ana Demonstração', 'RJ', 150, [[140, 'Petição inicial'], [100, 'Pedido de perícia contábil'], [20, 'Laudo pericial juntado']]],
    ['5002345-67.2026.8.13.0702', 'Despejo por falta de pagamento', 'Condomínio Residencial Modelo', 'Dr. Bruno Fictício', 'MG', 120, [[110, 'Petição inicial'], [45, 'Liminar deferida']]],
    ['0700789-12.2026.8.07.0001', 'Ação trabalhista de horas extras', 'Padaria Exemplo Ltda', 'Dra. Ana Demonstração', 'DF', 95, [[90, 'Reclamação distribuída'], [30, 'Audiência inicial marcada']]],
    ['5003456-78.2026.8.13.0079', 'Usucapião de imóvel urbano', 'Maria Fictícia', 'Dr. Bruno Fictício', 'MG', 70, [[65, 'Petição inicial']]],
    ['1001567-89.2026.8.21.0001', 'Cobrança de nota promissória', 'Oficina Modelo ME', 'Dra. Ana Demonstração', 'RS', 40, [[35, 'Distribuição'], [10, 'Mandado de citação expedido']]],
    ['0800890-23.2026.8.16.0001', 'Revisão de pensão alimentícia', 'João Exemplo', 'Dr. Bruno Fictício', 'PR', 15, [[12, 'Petição inicial protocolada']]],
];

const diasAtras = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

async function main() {
    if (process.env.DEMO_MODE !== 'true') {
        throw new Error('reset-demo só roda com DEMO_MODE=true (proteção contra apagar outro banco).');
    }
    const email = process.env.DEMO_EMAIL;
    const senha = process.env.DEMO_PASSWORD;
    if (!email || !senha) throw new Error('Defina DEMO_EMAIL e DEMO_PASSWORD.');
    const passwordHash = await passwordHasher.hash(senha);

    await prisma.$transaction(async (tx) => {
        await tx.andamento.deleteMany();
        await tx.processos.deleteMany();
        await tx.emailVerificationToken.deleteMany();
        await tx.passwordResetToken.deleteMany();
        await tx.user.deleteMany();
        const user = await tx.user.create({
            data: { email, passwordHash, nome: 'Conta de demonstração', emailVerifiedAt: new Date() },
        });
        for (const [numeroProcesso, descricao, cliente, advogado, uf, abertura, andamentos] of PROCESSOS) {
            await tx.processos.create({
                data: {
                    numeroProcesso, descricao, cliente, advogado, uf,
                    dataAbertura: diasAtras(abertura),
                    userId: user.id,
                    andamentos: { create: andamentos.map(([dias, texto]) => ({ data: diasAtras(dias), descricao: texto })) },
                },
            });
        }
    });
    console.log(`Demonstração restaurada: 1 conta, ${PROCESSOS.length} processos.`);
}

main()
    .catch((error) => { console.error(error.message); process.exitCode = 1; })
    .finally(() => prisma.$disconnect());
