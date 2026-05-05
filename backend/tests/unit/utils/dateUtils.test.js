// Objetivo: garantir que o helper de data transforma datas corretamente e protege a regra de não ser possível acrescentar datas futuras

const { parseDataBrasileiraOuIso } = require('../../../src/utils/dateUtils');

describe('dateUtils', () =>{
    test('faz parse de data brasileira',() => {
        const data = parseDataBrasileiraOuIso('10/05/2025');

        expect(data).toBeInstanceOf(Date);
        expect(data.getFullYear()).toBe(2025);
        expect(data.getMonth()).toBe(4);
        expect(data.getDate()).toBe(10);
        expect(data.getHours()).toBe(12);
    });

    test('faz parse de data ISO', () => {
        const data = parseDataBrasileiraOuIso('2025-05-10');

        expect(data.getFullYear()).toBe(2025);
        expect(data.getMonth()).toBe(4);
        expect(data.getDate()).toBe(10);
    });

    test('lança erro pra data inválida', () => {
        expect(() => {
            parseDataBrasileiraOuIso('', 'Data de abertura');
        }).toThrow('Data de abertura inválida');
    });

    test('limita data futura ao dia atual', () => {
        const data = parseDataBrasileiraOuIso('2999-01-01');
        const hoje = new Date();

        expect(data.getFullYear()).toBe(hoje.getFullYear());
        expect(data.getMonth()).toBe(hoje.getMonth());
        expect(data.getDate()).toBe(hoje.getDate());
        expect(data.getHours()).toBe(12);
    });
});
