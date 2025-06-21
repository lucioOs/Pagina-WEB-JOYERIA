const express = require('express');
const router = express.Router();
const detalleVentaController = require('../controllers/detalleventa.controller');

// CRUD con claves compuestas
router.get('/', detalleVentaController.getAll);
router.get('/:clave_venta/:clave_joya', detalleVentaController.getById);
router.post('/', detalleVentaController.create);
router.put('/:clave_venta/:clave_joya', detalleVentaController.update);
router.delete('/:clave_venta/:clave_joya', detalleVentaController.remove);

module.exports = router;
