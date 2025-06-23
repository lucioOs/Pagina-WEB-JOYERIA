// backend/controllers/estados.controller.js
const { getConnection } = require('../config/db');

const getEstados = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      'SELECT CLAVE, NOMBRE FROM CLAVE_ESTADO',
      [],
      { outFormat: conn.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error en /api/estados:', err);
    res.status(500).json({ error: 'Error al obtener estados' });
  } finally {
    if (conn) await conn.close();
  }
};

module.exports = { getEstados };

