// backend/controllers/estados.controller.js
const { oracledb } = require('../config/db');

const getEstados = async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection();
    const result = await conn.execute(
      `SELECT CLAVE, NOMBRE FROM CLAVE_ESTADO ORDER BY CLAVE`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener estados:', err);
    res.status(500).json({ error: 'Error al obtener estados' });
  } finally {
    if (conn) await conn.close();
  }
};

module.exports = { getEstados };
