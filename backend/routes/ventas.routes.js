const express = require('express');
const router = express.Router();
const ventasCtrl = require('../controllers/ventas.controller');

router.get('/', ventasCtrl.getVentas);
router.get('/:clave', ventasCtrl.getVentaPorClave);
router.post('/', ventasCtrl.crearVenta);
router.put('/:clave', ventasCtrl.actualizarVenta);
router.delete('/:clave', ventasCtrl.eliminarVenta);

module.exports = router;
