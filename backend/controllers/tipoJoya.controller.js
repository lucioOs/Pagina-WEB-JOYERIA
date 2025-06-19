const { oracledb } = require('../config/db');

const getTiposJoya = async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection();
    const result = await conn.execute(`
      SELECT tj.CLAVE, tj.NOMBRE, m.NOMBRE AS MATERIAL
      FROM TIPO_JOYA tj
      LEFT JOIN MATERIAL m ON tj.MATERIAL_CLAVE = m.CLAVE
    `);
    res.json(result.rows.map(r => ({
      CLAVE: r[0],
      NOMBRE: r[1],
      MATERIAL: r[2]
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

const createTipoJoya = async (req, res) => {
  const { CLAVE, NOMBRE, MATERIAL_CLAVE } = req.body;
  let conn;
  try {
    conn = await oracledb.getConnection();
    await conn.execute(
      `INSERT INTO TIPO_JOYA (CLAVE, NOMBRE, MATERIAL_CLAVE) VALUES (:1, :2, :3)`,
      [CLAVE, NOMBRE, MATERIAL_CLAVE],
      { autoCommit: true }
    );
    res.send('✔️ Tipo de joya agregado');
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

const updateTipoJoya = async (req, res) => {
  const { clave } = req.params;
  const { NOMBRE, MATERIAL_CLAVE } = req.body;
  let conn;
  try {
    conn = await oracledb.getConnection();
    await conn.execute(
      `UPDATE TIPO_JOYA SET NOMBRE = :1, MATERIAL_CLAVE = :2 WHERE CLAVE = :3`,
      [NOMBRE, MATERIAL_CLAVE, clave],
      { autoCommit: true }
    );
    res.send('✔️ Tipo de joya actualizado');
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

const deleteTipoJoya = async (req, res) => {
  const { clave } = req.params;
  let conn;
  try {
    conn = await oracledb.getConnection();
    await conn.execute(
      `DELETE FROM TIPO_JOYA WHERE CLAVE = :1`,
      [clave],
      { autoCommit: true }
    );
    res.send('✔️ Tipo de joya eliminado');
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

module.exports = {
  getTiposJoya,
  createTipoJoya,
  updateTipoJoya,
  deleteTipoJoya
};
