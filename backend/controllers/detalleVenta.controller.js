const { oracledb } = require('../config/db');

const getTodosLosDetalles = async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection();
    const result = await conn.execute(
      `SELECT 
         dv.CLAVE_VENTA,
         dv.CLAVE_JOYA,
         j.NOMBRE AS NOMBRE_JOYA,
         dv.CANTIDAD
       FROM DETALLE_VENTA dv
       JOIN JOYA j ON dv.CLAVE_JOYA = j.CLAVE`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener detalles de ventas:', err);
    res.status(500).json({ error: 'Error al obtener detalles', details: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

module.exports = { getTodosLosDetalles };
