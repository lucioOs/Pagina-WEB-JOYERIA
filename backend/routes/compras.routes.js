const express = require('express');
const router = express.Router();
const {
  getCompras,
  createCompra,
  updateCompra,
  deleteCompra
} = require('../controllers/compras.controller');

router.get('/', getCompras);
router.post('/', createCompra);
router.put('/:clave', updateCompra);
router.delete('/:clave', deleteCompra);

module.exports = router;
