const { oracledb, getConnection } = require('../config/db');

// GET - Obtener todos los roles
const obtenerRoles = async (req, res) => {
  try {
    const conn = await getConnection();
    const result = await conn.execute(
      `SELECT CLAVE, NOMBRE FROM ROL`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
    await conn.close();
  } catch (err) {
    console.error('❌ Error al obtener roles:', err);
    res.status(500).json({ mensaje: 'Error al obtener roles' });
  }
};

// POST - Crear nuevo rol
const crearRol = async (req, res) => {
  const { NOMBRE } = req.body;
  try {
    const conn = await getConnection();
    await conn.execute(
      `INSERT INTO ROL (CLAVE, NOMBRE) VALUES (SEQ_ROL.NEXTVAL, :nombre)`,
      [NOMBRE],
      { autoCommit: true }
    );
    res.status(201).json({ mensaje: 'Rol creado correctamente' });
    await conn.close();
  } catch (err) {
    console.error('❌ Error al crear rol:', err);
    res.status(500).json({ mensaje: 'Error al crear rol' });
  }
};

// PUT - Actualizar rol
const actualizarRol = async (req, res) => {
  const { clave } = req.params;
  const { NOMBRE } = req.body;

  try {
    const conn = await getConnection();
    await conn.execute(
      `UPDATE ROL SET NOMBRE = :nombre WHERE CLAVE = :clave`,
      [NOMBRE, clave],
      { autoCommit: true }
    );
    res.json({ mensaje: 'Rol actualizado correctamente' });
    await conn.close();
  } catch (err) {
    console.error('❌ Error al actualizar rol:', err);
    res.status(500).json({ mensaje: 'Error al actualizar rol' });
  }
};

// DELETE - Eliminar rol
const eliminarRol = async (req, res) => {
  const { clave } = req.params;
  let conn;
  try {
    conn = await getConnection();
    await conn.execute(
      `DELETE FROM ROL WHERE CLAVE = :clave`,
      [clave],
      { autoCommit: true }
    );
    res.json({ mensaje: 'Rol eliminado correctamente' });
  } catch (err) {
    console.error('❌ Error al eliminar rol:', err);

    if (err.errorNum === 2292) {
      // ORA-02292: integridad referencial (hijos relacionados)
      res.status(400).json({
        error: 'No se puede eliminar el rol porque está asignado a uno o más empleados.',
      });
    } else {
      res.status(500).json({
        error: 'Error desconocido al eliminar el rol',
      });
    }
  } finally {
    if (conn) await conn.close();
  }
};

module.exports = {
  obtenerRoles,
  crearRol,
  actualizarRol,
  eliminarRol,
};
