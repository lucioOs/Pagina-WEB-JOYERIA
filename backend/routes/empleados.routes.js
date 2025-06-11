const express = require('express');
const router = express.Router();
const empleadosCtrl = require('../controllers/empleados.controller');

// Solo esta ruta por ahora
router.get('/', empleadosCtrl.getEmpleados);
router.get('/:clave', empleadosCtrl.getEmpleadoPorClave);
router.post('/', empleadosCtrl.crearEmpleado);
router.put('/:clave', empleadosCtrl.actualizarEmpleado);
router.delete('/:clave', empleadosCtrl.eliminarEmpleado);


module.exports = router;
