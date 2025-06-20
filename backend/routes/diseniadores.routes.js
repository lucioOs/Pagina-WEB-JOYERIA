const express = require('express');
const router = express.Router();
const diseniadoresCtrl = require('../controllers/diseniadores.controller');

// Obtener todos los diseñadores
router.get('/', diseniadoresCtrl.obtenerDiseniadores);

// Agregar diseñador (clave automática)
router.post('/', diseniadoresCtrl.agregarDiseniador);

// Actualizar diseñador
router.put('/:clave', diseniadoresCtrl.actualizarDiseniador);

// Eliminar diseñador
router.delete('/:clave', diseniadoresCtrl.eliminarDiseniador);

module.exports = router;
