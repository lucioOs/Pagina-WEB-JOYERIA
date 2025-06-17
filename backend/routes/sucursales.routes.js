// backend/routes/sucursales.routes.js
const express = require('express');
const router = express.Router();
const sucursalCtrl = require('../controllers/sucursales.controller');

router.get('/', sucursalCtrl.getSucursales); // para traer todas las sucursales

module.exports = router;
