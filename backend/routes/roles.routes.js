const express = require('express');
const router = express.Router();
const { oracledb, getConnection } = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const conn = await getConnection();
    const result = await conn.execute(
      `SELECT CLAVE, NOMBRE FROM ROL`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    await conn.close();
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener roles:', err);
    res.status(500).json({ mensaje: 'Error al obtener roles' });
  }
});

module.exports = router;
