const { oracledb } = require('../config/db');

// Obtener todos los diseñadores
const obtenerDiseniadores = async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection();
    const result = await conn.execute(
      `SELECT CLAVE, NOMBRE, AP_PAT FROM DISENIADOR ORDER BY CLAVE`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error al obtener diseñadores:", err);
    res.status(500).json({ error: "Error al obtener diseñadores" });
  } finally {
    if (conn) await conn.close();
  }
};

// Agregar diseñador
const agregarDiseniador = async (req, res) => {
  const { NOMBRE, AP_PAT } = req.body;
  let conn;
  try {
    conn = await oracledb.getConnection();

    const result = await conn.execute(
      `SELECT LPAD(NVL(MAX(TO_NUMBER(SUBSTR(CLAVE, 4))), 0) + 1, 3, '0') AS NUEVO_NUM
       FROM DISENIADOR
       WHERE REGEXP_LIKE(SUBSTR(CLAVE, 4), '^[0-9]+$')`
    );

    const nuevoNumero = result.rows[0].NUEVO_NUM;
    const nuevaClave = `DIS${nuevoNumero}`;

    await conn.execute(
      `INSERT INTO DISENIADOR (CLAVE, NOMBRE, AP_PAT)
       VALUES (:CLAVE, :NOMBRE, :AP_PAT)`,
      { CLAVE: nuevaClave, NOMBRE, AP_PAT },
      { autoCommit: true }
    );

    res.status(201).json({ message: "Diseñador agregado correctamente", clave: nuevaClave });
  } catch (err) {
    console.error("❌ Error al agregar diseñador:", err);
    res.status(500).json({ error: "Error al agregar diseñador" });
  } finally {
    if (conn) await conn.close();
  }
};

// Actualizar diseñador
const actualizarDiseniador = async (req, res) => {
  const clave = req.params.clave;
  const { NOMBRE, AP_PAT } = req.body;
  let conn;
  try {
    conn = await oracledb.getConnection();
    await conn.execute(
      `UPDATE DISENIADOR SET NOMBRE = :NOMBRE, AP_PAT = :AP_PAT WHERE CLAVE = :CLAVE`,
      { CLAVE: clave, NOMBRE, AP_PAT },
      { autoCommit: true }
    );
    res.json({ message: "Diseñador actualizado correctamente" });
  } catch (err) {
    console.error("❌ Error al actualizar diseñador:", err);
    res.status(500).json({ error: "Error al actualizar diseñador" });
  } finally {
    if (conn) await conn.close();
  }
};

// Eliminar diseñador
const eliminarDiseniador = async (req, res) => {
  const clave = req.params.clave;
  let conn;
  try {
    conn = await oracledb.getConnection();
    await conn.execute(
      `DELETE FROM DISENIADOR WHERE CLAVE = :CLAVE`,
      { CLAVE: clave },
      { autoCommit: true }
    );
    res.json({ message: "Diseñador eliminado correctamente" });
  } catch (err) {
    console.error("❌ Error al eliminar diseñador:", err);
    res.status(500).json({ error: "Error al eliminar diseñador" });
  } finally {
    if (conn) await conn.close();
  }
};

module.exports = {
  obtenerDiseniadores,
  agregarDiseniador,
  actualizarDiseniador,
  eliminarDiseniador,
};
