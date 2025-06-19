const express = require('express');
const createCrudHandlers = require('../controllers/genericCrud.controller');
const router = express.Router();

const tables = {
  SUCURSAL: ['CLAVE'],
  DIRECCION_SUCURSAL: ['CLAVE'],
  RED_SOCIAL: ['CLAVE_RED'],
  DISENIADOR: ['CLAVE'],
  SUCURSAL_RED: ['CLAVE'],
  MATERIAL: ['CLAVE'],
  ROL: ['CLAVE'],
  METODO_PAGO: ['CLAVE'],
  TIPO_ENVIO: ['CLAVE'],
  EMPLEADO: ['CLAVE'],
  CLIENTE: ['CLAVE'],
  DIRECCION_CLIENTE: ['CLAVE'],
  PROMOCION: ['CLAVE'],
  ESTADO_PEDIDO: ['CLAVE'],
  VENTA: ['CLAVE'],
  JOYA: ['CLAVE'],
  DETALLE_VENTA: ['CLAVE_VENTA', 'CLAVE_JOYA'],
  PEDIDO: ['CLAVE'],
  DETALLE_PEDIDO: ['CLAVE'],
  MOTIVO_DEVOLUCION: ['CLAVE'],
  DEVOLUCION: ['CLAVE'],
  DETALLE_DEVOLUCION: ['CLAVE'],
  INVENTARIO: ['CLAVE_JOYA', 'CLAVE_SUCURSAL'],
  TIPO_JOYA: ['CLAVE'],
  CLAVE_ESTADO: ['CLAVE'],
  DIRECCION_EMPLEADO: ['CLAVE'],
  DISTRIBUIDOR: ['CLAVE'],
  COMPRA: ['CLAVE'],
  DETALLE_COMPRA: ['CLAVE']
};

Object.entries(tables).forEach(([tableName, primaryKeys]) => {
  const handlers = createCrudHandlers(tableName, primaryKeys);
  const base = `/api/${tableName.toLowerCase()}`; // añade /api aquí si quieres rutas REST comunes

  router.get(base, handlers.getAll);
  router.post(base, handlers.create);

  const pkPath = primaryKeys.map(pk => `/:${pk.toLowerCase()}`).join('');
  router.get(base + pkPath, handlers.getById);
  router.put(base + pkPath, handlers.update);
  router.delete(base + pkPath, handlers.remove);
});

module.exports = router;
