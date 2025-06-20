const express = require('express');
const router = express.Router();
const {
  obtenerMateriales,
  agregarMaterial,
  actualizarMaterial,
  eliminarMaterial
} = require('../controllers/materiales.controller');

router.get('/', obtenerMateriales);
router.post('/', agregarMaterial);
router.put('/:clave', actualizarMaterial);
router.delete('/:clave', eliminarMaterial);

module.exports = router;
