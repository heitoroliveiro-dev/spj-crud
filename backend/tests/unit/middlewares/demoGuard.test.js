const demoGuard = require('../../../src/middlewares/demoGuard');

describe('demoGuard (spec 002)', () => {
    const original = process.env.DEMO_MODE;
    afterEach(() => { process.env.DEMO_MODE = original; });

    const run = () => {
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
        const next = jest.fn();
        demoGuard({}, res, next);
        return { res, next };
    };

    test('com DEMO_MODE=true responde 403 e não segue', () => {
        process.env.DEMO_MODE = 'true';
        const { res, next } = run();
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: 'Indisponível na demonstração' });
        expect(next).not.toHaveBeenCalled();
    });

    test('sem DEMO_MODE segue normalmente', () => {
        delete process.env.DEMO_MODE;
        const { res, next } = run();
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });
});
