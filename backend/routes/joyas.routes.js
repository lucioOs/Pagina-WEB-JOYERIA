// backend/routes/joyas.routes.js
const express = require('express');
const router = express.Router();
const joyasCtrl = require('../controllers/joyas.controller');

// ✅ Rutas adicionales primero (para evitar conflictos con /:clave)
router.get('/tipos', joyasCtrl.obtenerTipos);
router.get('/materiales', joyasCtrl.obtenerMateriales);

// ✅ Rutas principales
router.get('/', joyasCtrl.getJoyas);
router.post('/', joyasCtrl.crearJoya);
router.put('/:clave', joyasCtrl.actualizarJoya);
router.delete('/:clave', joyasCtrl.eliminarJoya);

// ❗ Esta va al final porque captura cualquier valor dinámico
router.get('/:clave', joyasCtrl.getJoyaPorClave);

module.exports = router;
