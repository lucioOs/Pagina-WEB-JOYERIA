const { getConnection } = require('../config/db');

const getDistribuidores = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT CLAVE, NOMBRE FROM DISTRIBUIDOR`,
      [],
      { outFormat: connection.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error al obtener distribuidores:', error);
    res.status(500).json({ error: 'Error al obtener distribuidores' });
  } finally {
    if (connection) await connection.close();
  }
};

module.exports = { getDistribuidores };
