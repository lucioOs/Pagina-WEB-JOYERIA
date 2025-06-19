// backend/routes/clientes.routes.js
const express = require('express');
const router = express.Router();
const clientesCtrl = require('../controllers/clientes.controller');

// ✅ Rutas principales
router.get('/', clientesCtrl.getClientes);
router.post('/', clientesCtrl.crearCliente);
router.put('/:clave', clientesCtrl.actualizarCliente);
router.delete('/:clave', clientesCtrl.eliminarCliente);

// ❗ Esta va al final porque captura cualquier valor dinámico
router.get('/:clave', clientesCtrl.getClientePorClave);

module.exports = router;
