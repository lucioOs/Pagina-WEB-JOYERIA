const express = require('express');
const router = express.Router();
const empleadosCtrl = require('../controllers/empleados.controller');

router.get('/', empleadosCtrl.getEmpleados);
router.post('/', empleadosCtrl.crearEmpleado);
router.put('/:clave', empleadosCtrl.actualizarEmpleado);
router.delete('/:clave', empleadosCtrl.eliminarEmpleado);
router.get('/:clave', empleadosCtrl.getEmpleadoPorClave);

module.exports = router;
