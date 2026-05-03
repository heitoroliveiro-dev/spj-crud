const router = require('express').Router();
const andamentoController = require('../controllers/andamentoController');

router.put('/:id', andamentoController.update);
router.delete('/:id', andamentoController.destroy);

module.exports = router;