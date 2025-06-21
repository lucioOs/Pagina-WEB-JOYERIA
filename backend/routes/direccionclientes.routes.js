const express = require('express');
const router = express.Router();
const dirCtrl = require('../controllers/direccionclientes.controller');

router.get('/', dirCtrl.getDireccionesClientes);
router.post('/', dirCtrl.crearDireccionCliente);
router.put('/:clave', dirCtrl.actualizarDireccionCliente);
router.delete('/:clave', dirCtrl.eliminarDireccionCliente);

module.exports = router;

