const express = require('express');
const router = express.Router();
const empleadosController = require('../controllers/empleados.controller');

// Rutas
router.get('/', empleadosController.getEmpleados);
router.post('/', empleadosController.crearEmpleado);
router.put('/:clave', empleadosController.actualizarEmpleado);
router.delete('/:clave', empleadosController.eliminarEmpleado);

module.exports = router;
