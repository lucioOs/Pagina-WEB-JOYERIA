const { oracledb } = require('../config/db');

// Obtener todos los empleados
const getEmpleados = async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection();
    const result = await conn.execute(
      `SELECT e.CLAVE, e.NOMBRE, e.APELLIDO_PAT, e.CORREO, r.NOMBRE AS ROL
       FROM EMPLEADO e
       JOIN ROL r ON e.CLAVE_ROL = r.CLAVE`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Error al obtener empleados');
  } finally {
    if (conn) await conn.close();
  }
};

// Obtener un empleado por clave
const getEmpleadoPorClave = async (req, res) => {
  const { clave } = req.params;
  let conn;
  try {
    conn = await oracledb.getConnection();
    const result = await conn.execute(
      `SELECT e.CLAVE, e.NOMBRE, e.APELLIDO_PAT, e.CORREO, r.NOMBRE AS ROL
       FROM EMPLEADO e
       JOIN ROL r ON e.CLAVE_ROL = r.CLAVE
       WHERE e.CLAVE = :clave`,
      [clave],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    if (result.rows.length === 0) {
      res.status(404).send('Empleado no encontrado');
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    res.status(500).send('Error al obtener empleado');
  } finally {
    if (conn) await conn.close();
  }
};

// Crear nuevo empleado
const crearEmpleado = async (req, res) => {
  const { CLAVE, NOMBRE, APELLIDO_PAT, CORREO, CLAVE_ROL } = req.body;
  if (!CLAVE || !NOMBRE || !CORREO || !CLAVE_ROL) {
    return res.status(400).send('Faltan campos obligatorios');
  }
  let conn;
  try {
    conn = await oracledb.getConnection();
    await conn.execute(
      `INSERT INTO EMPLEADO (CLAVE, NOMBRE, APELLIDO_PAT, CORREO, CLAVE_ROL)
       VALUES (:CLAVE, :NOMBRE, :APELLIDO_PAT, :CORREO, :CLAVE_ROL)`,
      { CLAVE, NOMBRE, APELLIDO_PAT, CORREO, CLAVE_ROL },
      { autoCommit: true }
    );
    res.status(201).send('Empleado creado exitosamente');
  } catch (err) {
    res.status(500).send('Error al crear empleado: ' + err.message);
  } finally {
    if (conn) await conn.close();
  }
};

// Actualizar empleado existente
const actualizarEmpleado = async (req, res) => {
  const { clave } = req.params;
  const { NOMBRE, APELLIDO_PAT, CORREO, CLAVE_ROL } = req.body;
  if (!NOMBRE || !CORREO || !CLAVE_ROL) {
    return res.status(400).send('Faltan campos obligatorios');
  }
  let conn;
  try {
    conn = await oracledb.getConnection();
    const result = await conn.execute(
      `UPDATE EMPLEADO SET 
         NOMBRE = :NOMBRE,
         APELLIDO_PAT = :APELLIDO_PAT,
         CORREO = :CORREO,
         CLAVE_ROL = :CLAVE_ROL
       WHERE CLAVE = :clave`,
      { NOMBRE, APELLIDO_PAT, CORREO, CLAVE_ROL, clave },
      { autoCommit: true }
    );
    if (result.rowsAffected === 0) {
      res.status(404).send('Empleado no encontrado');
    } else {
      res.send('Empleado actualizado correctamente');
    }
  } catch (err) {
    res.status(500).send('Error al actualizar empleado: ' + err.message);
  } finally {
    if (conn) await conn.close();
  }
};

// Eliminar empleado
const eliminarEmpleado = async (req, res) => {
  const { clave } = req.params;
  let conn;
  try {
    conn = await oracledb.getConnection();
    const result = await conn.execute(
      `DELETE FROM EMPLEADO WHERE CLAVE = :clave`,
      [clave],
      { autoCommit: true }
    );
    if (result.rowsAffected === 0) {
      res.status(404).send('Empleado no encontrado');
    } else {
      res.send('Empleado eliminado correctamente');
    }
  } catch (err) {
    res.status(500).send('Error al eliminar empleado: ' + err.message);
  } finally {
    if (conn) await conn.close();
  }
};

module.exports = {
  getEmpleados,
  getEmpleadoPorClave,
  crearEmpleado,
  actualizarEmpleado,
  eliminarEmpleado
};
