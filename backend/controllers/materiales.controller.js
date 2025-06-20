const { oracledb } = require('../config/db');

// Obtener todos los materiales
const obtenerMateriales = async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection();
    const result = await conn.execute(
      `SELECT CLAVE, NOMBRE FROM MATERIAL ORDER BY CLAVE`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener materiales:", err);
    res.status(500).json({ error: "Error al obtener materiales" });
  } finally {
    if (conn) await conn.close();
  }
};

// Agregar nuevo material (clave automática)
const agregarMaterial = async (req, res) => {
  const { NOMBRE } = req.body;
  let conn;
  try {
    conn = await oracledb.getConnection();
    await conn.execute(
      `INSERT INTO MATERIAL (CLAVE, NOMBRE) VALUES (SEQ_CLAVE_MATERIAL.NEXTVAL, :NOMBRE)`,
      { NOMBRE },
      { autoCommit: true }
    );
    res.status(201).json({ message: "Material agregado correctamente" });
  } catch (err) {
    console.error("Error al agregar material:", err);
    res.status(500).json({ error: "Error al agregar material" });
  } finally {
    if (conn) await conn.close();
  }
};

// ✅ Actualizar material por clave
const actualizarMaterial = async (req, res) => {
  const clave = req.params.clave;
  const { NOMBRE } = req.body;
  let conn;
  try {
    conn = await oracledb.getConnection();
    const result = await conn.execute(
      `UPDATE MATERIAL SET NOMBRE = :NOMBRE WHERE CLAVE = :CLAVE`,
      { CLAVE: Number(clave), NOMBRE },
      { autoCommit: true }
    );
    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: "Material no encontrado" });
    }
    res.json({ message: "Material actualizado correctamente" });
  } catch (err) {
    console.error("Error al actualizar material:", err);
    res.status(500).json({ error: "Error al actualizar material" });
  } finally {
    if (conn) await conn.close();
  }
};

// ✅ Eliminar material por clave
const eliminarMaterial = async (req, res) => {
  const clave = req.params.clave;
  let conn;
  try {
    conn = await oracledb.getConnection();
    const result = await conn.execute(
      `DELETE FROM MATERIAL WHERE CLAVE = :CLAVE`,
      { CLAVE: Number(clave) },
      { autoCommit: true }
    );
    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: "Material no encontrado" });
    }
    res.json({ message: "Material eliminado correctamente" });
  } catch (err) {
    console.error("Error al eliminar material:", err);
    res.status(500).json({ error: "Error al eliminar material" });
  } finally {
    if (conn) await conn.close();
  }
};

module.exports = {
  obtenerMateriales,
  agregarMaterial,
  actualizarMaterial,
  eliminarMaterial,
};
