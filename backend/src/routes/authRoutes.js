const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');
const demoGuard = require('../middlewares/demoGuard');

/* Protege contra força bruta e contra estourar a cota diária do provedor de e-mail (Brevo) */
const limiteAuth = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Muitas tentativas. Tente novamente em alguns minutos.' },
});

router.post('/signup', demoGuard, limiteAuth, authController.signup);
router.post('/verify-email', authController.verifyEmail);
router.post('/login', limiteAuth, authController.login);
router.post('/forgot-password', demoGuard, limiteAuth, authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
