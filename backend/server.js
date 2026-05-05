require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const PUBLIC_BACKEND_URL = process.env.PUBLIC_BACKEND_URL || `http://localhost:${PORT}`;

const server = app.listen(PORT, () => {
    console.log('==============================================');
    console.log('SPJ iniciado com sucesso');
    console.log(`Servidor backend rodando na porta ${PORT}`);
    console.log('----------------------------------------------');
    console.log(`Frontend:        ${FRONTEND_URL}`);
    console.log(`Backend API:     ${PUBLIC_BACKEND_URL}`);
    console.log(`Healthcheck:     ${PUBLIC_BACKEND_URL}/health`);
    console.log('==============================================');
    console.log('');
});

module.exports = server;
