const express = require('express');
const router = express.Router();
const joyasCtrl = require('../controllers/joyas.controller');

// Rutas auxiliares para selects
router.get('/tipos', joyasCtrl.obtenerTipos);        // Lista de tipos de joya
router.get('/materiales', joyasCtrl.obtenerMateriales); // Lista de materiales

// Rutas CRUD principales
router.get('/', joyasCtrl.getJoyas);                      // Obtener todas las joyas
router.post('/', joyasCtrl.crearJoya);                    // Crear nueva joya
router.put('/:clave', joyasCtrl.actualizarJoya);          // Actualizar joya
router.delete('/:clave', joyasCtrl.eliminarJoya);         // Eliminar joya
router.get('/:clave', joyasCtrl.getJoyaPorClave);         // Obtener joya específica

module.exports = router;
