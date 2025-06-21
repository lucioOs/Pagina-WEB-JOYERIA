const express = require('express');
const router = express.Router();
const {
  getPromociones,
  createPromocion,
  updatePromocion,
  deletePromocion
} = require('../controllers/promociones.controller');

// GET - Obtener todas las promociones
router.get('/', getPromociones);

// POST - Crear una nueva promoción
router.post('/', createPromocion);

// PUT - Actualizar promoción
router.put('/:clave', updatePromocion);

// DELETE - Eliminar promoción
router.delete('/:clave', deletePromocion);

module.exports = router;
