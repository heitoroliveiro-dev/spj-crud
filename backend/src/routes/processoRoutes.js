// backend/src/routes/processoRoutes.js
const router = require('express').Router();
const processoController = require('../controllers/processoController');

router.get('/', processoController.index);
router.get('/:id', processoController.show);
router.post('/', processoController.store);
router.put('/:id', processoController.update);
router.delete('/:id', processoController.destroy);

module.exports = router;