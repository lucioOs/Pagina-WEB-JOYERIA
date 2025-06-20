const express = require('express');
const router = express.Router();
const createCrudHandlers = require('../controllers/genericCrud.controller');

const handlers = createCrudHandlers('METODO_PAGO', ['CLAVE']);

router.get('/', handlers.getAll);
router.get('/:clave', handlers.getById);
router.post('/', handlers.create);
router.put('/:clave', handlers.update);
router.delete('/:clave', handlers.remove);

module.exports = router;
