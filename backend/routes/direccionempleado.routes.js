const express = require('express');
const router = express.Router();
const {
  obtenerDirecciones,
  crearDireccion,
  actualizarDireccion,
  eliminarDireccion
} = require('../controllers/direccionempleado.controller');

// Rutas
router.get('/', obtenerDirecciones);
router.post('/', crearDireccion);
router.put('/:id', actualizarDireccion);
router.delete('/:id', eliminarDireccion);

module.exports = router;
