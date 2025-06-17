// backend/controllers/sucursales.controller.js
const { oracledb } = require('../config/db');

const getSucursales = async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection();
    const result = await conn.execute(
      `SELECT CLAVE, NOMBRE FROM SUCURSAL`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Error al obtener sucursales');
  } finally {
    if (conn) await conn.close();
  }
};

module.exports = { getSucursales };
