const express = require('express');
const router = express.Router();
const diseniadoresCtrl = require('../controllers/diseniadores.controller');

// Obtener todos los diseñadores
router.get('/', diseniadoresCtrl.obtenerDiseniadores);

// Crear diseñador
router.post('/', diseniadoresCtrl.crearDiseniador);

// Actualizar diseñador
router.put('/:clave', diseniadoresCtrl.actualizarDiseniador);

// Eliminar diseñador
router.delete('/:clave', diseniadoresCtrl.eliminarDiseniador);

// Obtener diseñador por clave
router.get('/:clave', diseniadoresCtrl.obtenerDiseniadorPorClave);

module.exports = router;
