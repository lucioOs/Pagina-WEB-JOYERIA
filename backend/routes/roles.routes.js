const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
  try {
 const result = await oracledb.getConnection();
const query = await result.execute(
  `SELECT CLAVE, NOMBRE FROM ROL`,
  [],
  { outFormat: oracledb.OUT_FORMAT_OBJECT }
);
await result.close();
res.json(query.rows); // cada fila ya es { CLAVE: ..., NOMBRE: ... }

  } catch (err) {
    console.error('Error al obtener roles:', err);
    res.status(500).json({ mensaje: 'Error al obtener roles' });
  }
});

module.exports = router;
