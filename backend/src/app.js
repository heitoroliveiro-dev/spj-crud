const express = require('express');
const cors = require('cors');
/* 
const processoRoutes = require('./routes/processoRoutes'); 
const andamentoRoutes = require('./routes/andamentoRoutes');
const errorHandler = require('./middlewares/errorHandler');
*/

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

/*
app.use('/api/processos', processosRoutes);
app.use('/api/andamentos', andamentosRoutes);
*/

app.get('/health', (req,res) => res.json({ status: 'ok' }));

app.use(errorHandler);

module.exports = app;