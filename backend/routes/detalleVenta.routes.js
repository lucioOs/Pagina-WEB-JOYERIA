const express = require('express');
const router = express.Router();
const { getTodosLosDetalles } = require('../controllers/detalleVenta.controller');

router.get('/', getTodosLosDetalles);

module.exports = router;
