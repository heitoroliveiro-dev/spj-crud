const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');
const requireAuth = require('./middlewares/requireAuth');
const authRoutes = require('./routes/authRoutes');
const processoRoutes = require('./routes/processoRoutes');
const andamentoRoutes = require('./routes/andamentoRoutes');

const app = express();

/*
 * Spec 002: atrás de proxy reverso (borda Caddy na VPS), o IP do visitante vem em X-Forwarded-For.
 * TRUST_PROXY = número de proxies na frente (1 na VPS). Sem isso o limite de tentativas de login
 * contaria todos os visitantes como um só IP. Sem a variável, nada muda.
 */
if (process.env.TRUST_PROXY) {
  app.set('trust proxy', Number(process.env.TRUST_PROXY));
}

app.use(cors({
  origin: process.env.FRONTEND_URL,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    name: 'SPJ API',
    status: 'online',
    health: '/health',
    processos: '/api/processos',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/processos', requireAuth, processoRoutes);
app.use('/api/andamentos', requireAuth, andamentoRoutes);

app.get('/health', (req,res) => res.json({ status: 'ok' }));

app.use(errorHandler);

module.exports = app;
