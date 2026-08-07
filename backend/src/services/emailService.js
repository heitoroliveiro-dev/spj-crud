/**
 * Envia e-mails transacionais via API HTTP da Brevo (nunca SMTP — bloqueado no Render free tier).
 * Não conhece regra de negócio de auth, só monta e envia o e-mail.
 */

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

async function enviarEmail({ destinatario, assunto, html }) {
    const apiKey = process.env.BREVO_API_KEY;
    const remetente = process.env.EMAIL_FROM;

    if (!apiKey || !remetente) {
        throw new Error('BREVO_API_KEY/EMAIL_FROM não configurados');
    }

    const response = await fetch(BREVO_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'api-key': apiKey,
        },
        body: JSON.stringify({
            sender: { email: remetente, name: 'SPJ' },
            to: [{ email: destinatario }],
            subject: assunto,
            htmlContent: html,
        }),
    });

    if (!response.ok) {
        const corpo = await response.text().catch(() => '');
        throw new Error(`Falha ao enviar e-mail via Brevo (status ${response.status}): ${corpo}`);
    }
}

function linkComToken(base, caminho, token) {
    return `${base}${caminho}?token=${encodeURIComponent(token)}`;
}

const emailService = {
    /* e-mail de confirmação de cadastro */
    async enviarEmailVerificacao(destinatario, token) {
        const link = linkComToken(process.env.FRONTEND_URL, '/verificar-email', token);

        await enviarEmail({
            destinatario,
            assunto: 'Confirme seu e-mail — SPJ',
            html: `
                <p>Bem-vindo(a) ao SPJ.</p>
                <p>Confirme seu e-mail clicando no link abaixo:</p>
                <p><a href="${link}">${link}</a></p>
                <p>Se você não criou esta conta, ignore este e-mail.</p>
            `,
        });
    },

    /* e-mail de redefinição de senha */
    async enviarEmailRedefinicaoSenha(destinatario, token) {
        const link = linkComToken(process.env.FRONTEND_URL, '/redefinir-senha', token);

        await enviarEmail({
            destinatario,
            assunto: 'Redefinição de senha — SPJ',
            html: `
                <p>Recebemos um pedido de redefinição de senha para esta conta.</p>
                <p>Clique no link abaixo para definir uma nova senha:</p>
                <p><a href="${link}">${link}</a></p>
                <p>Se você não pediu isso, ignore este e-mail — sua senha continua a mesma.</p>
            `,
        });
    },
};

module.exports = emailService;
