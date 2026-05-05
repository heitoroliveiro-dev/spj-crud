module.exports = {
    testEnvironment: 'node', // ambiente de teste 'node'
    clearMocks: true,        // limpa os dados mocks pra evitar que um teste suje o outro
    collectCoverageFrom: [   // define quais arquivos vão entrar no relatório de cobertura
        'src/**/*.js',
        '!src/database/**',
        '!server.js'
    ]
}