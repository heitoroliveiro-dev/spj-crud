const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');
const processoRoutes = require('./routes/processoRoutes'); 
const andamentoRoutes = require('./routes/andamentoRoutes');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    name: 'SPJ API',
    status: 'online',
    health: '/health',
    processos: '/api/processos',
  });
});

app.use('/api/processos', processoRoutes);
app.use('/api/andamentos', andamentoRoutes);

app.get('/health', (req,res) => res.json({ status: 'ok' }));

app.use(errorHandler);

module.exports = app;
