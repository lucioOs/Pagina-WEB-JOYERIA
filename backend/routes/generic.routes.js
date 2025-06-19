const express = require('express');
const createCrudHandlers = require('../controllers/genericCrud.controller');
const router = express.Router();

const tables = {
  INVENTARIO: ['CLAVE_JOYA', 'CLAVE_SUCURSAL'],
  MATERIAL: ['CLAVE'],
  // Agrega más tablas si deseas
};

Object.entries(tables).forEach(([tableName, primaryKeys]) => {
  const handlers = createCrudHandlers(tableName, primaryKeys);
  const base = `/${tableName.toLowerCase()}`;

  router.get(base, handlers.getAll);
  router.post(base, handlers.create);

  const pkPath = primaryKeys.map(pk => `/:${pk.toLowerCase()}`).join('');
  router.get(base + pkPath, handlers.getById);
  router.put(base + pkPath, handlers.update);
  router.delete(base + pkPath, handlers.remove);
});

module.exports = router;
