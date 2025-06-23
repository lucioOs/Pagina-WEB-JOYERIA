const { oracledb } = require('../config/db');

// Obtener todos los empleados con dirección y rol
const getEmpleados = async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection();
    const result = await conn.execute(`
      SELECT 
        e.CLAVE, e.NOMBRE, e.APELLIDO_PAT, e.APELLIDO_MAT,
        TO_CHAR(e.FECHA_NAC, 'YYYY-MM-DD') AS FECHA_NAC,
        TO_CHAR(e.FECHA_REG, 'YYYY-MM-DD') AS FECHA_REG,
        e.TELEFONO, e.CORREO,
        r.NOMBRE AS ROL,
        d.ESTADO AS ESTADO_CLAVE, ce.NOMBRE AS ESTADO,
        d.MUNICIPIO, d.CP, d.COLONIA, d.CALLE, d.NUM_INT, d.NUM_EXT
      FROM EMPLEADO e
      JOIN ROL r ON e.CLAVE_ROL = r.CLAVE
      JOIN DIRECCION_EMPLEADO d ON e.CLAVE_DIRECCION = d.CLAVE
      JOIN CLAVE_ESTADO ce ON d.ESTADO = ce.CLAVE
    `, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error al obtener empleados:', err);
    res.status(500).send('Error al obtener empleados');
  } finally {
    if (conn) await conn.close();
  }
};

// Crear empleado con dirección
// Crear nuevo empleado con dirección
const crearEmpleado = async (req, res) => {
  const conn = await oracledb.getConnection();
  try {
    const {
      nombre, apellido_pat, apellido_mat, fecha_nac,
      fecha_reg, telefono, correo, rol,
      direccion
    } = req.body;

    if (!direccion || !direccion.estado) {
      throw new Error('El campo "ESTADO" es requerido en la dirección');
    }

    // ✅ 1. Obtener clave del estado (si se mandó el nombre como string)
    const estadoResult = await conn.execute(
      `SELECT CLAVE FROM CLAVE_ESTADO WHERE NOMBRE = :nombre`,
      [direccion.estado],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    if (estadoResult.rows.length === 0) {
      return res.status(400).json({ error: 'Estado no válido' });
    }
    const claveEstado = estadoResult.rows[0].CLAVE;

    // ✅ 2. Obtener clave del rol por nombre
    const rolResult = await conn.execute(
      `SELECT CLAVE FROM ROL WHERE NOMBRE = :nombre`,
      [rol],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    if (rolResult.rows.length === 0) {
      return res.status(400).json({ error: 'Rol no válido' });
    }
    const claveRol = rolResult.rows[0].CLAVE;

    // ✅ 3. Insertar dirección con clave de estado
    await conn.execute(
      `INSERT INTO DIRECCION_EMPLEADO (
        ESTADO, MUNICIPIO, CP, COLONIA, CALLE, NUM_INT, NUM_EXT
      ) VALUES (
        :ESTADO, :MUNICIPIO, :CP, :COLONIA, :CALLE, :NUM_INT, :NUM_EXT
      )`,
      {
        ESTADO: claveEstado,
        MUNICIPIO: direccion.municipio || '',
        CP: direccion.cp && !isNaN(direccion.cp) ? Number(direccion.cp) : null,
        COLONIA: direccion.colonia || '',
        CALLE: direccion.calle || '',
        NUM_INT: direccion.num_int && !isNaN(direccion.num_int) ? Number(direccion.num_int) : null,
        NUM_EXT: direccion.num_ext || ''
      }
    );

    // ✅ 4. Obtener la clave insertada por trigger/secuencia
    const dirResult = await conn.execute(
      `SELECT MAX(CLAVE) AS CLAVE FROM DIRECCION_EMPLEADO`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const claveDireccion = dirResult.rows[0].CLAVE;

    // ✅ 5. Insertar empleado
    await conn.execute(
      `INSERT INTO EMPLEADO (
        NOMBRE, APELLIDO_PAT, APELLIDO_MAT, FECHA_NAC, FECHA_REG,
        TELEFONO, CORREO, CLAVE_ROL, CLAVE_DIRECCION
      ) VALUES (
        :nombre, :apellido_pat, :apellido_mat, TO_DATE(:fecha_nac, 'YYYY-MM-DD'),
        TO_DATE(:fecha_reg, 'YYYY-MM-DD'), :telefono, :correo, :claveRol, :claveDireccion
      )`,
      {
        nombre, apellido_pat, apellido_mat,
        fecha_nac, fecha_reg, telefono, correo,
        claveRol, claveDireccion
      },
      { autoCommit: true }
    );

    res.status(201).json({ message: 'Empleado y dirección registrados correctamente' });

  } catch (err) {
    console.error('❌ Error al crear empleado:', err.message);
    res.status(500).json({ error: 'Error al registrar empleado' });
  } finally {
    if (conn) await conn.close();
  }
};


// Actualizar empleado y dirección
const actualizarEmpleado = async (req, res) => {
  const { clave } = req.params;
  const {
    nombre, apellido_pat, apellido_mat,
    fecha_nac, fecha_reg, telefono, correo,
    rol, direccion
  } = req.body;

  let conn;
  try {
    conn = await oracledb.getConnection();

    const dirResult = await conn.execute(
      `SELECT CLAVE_DIRECCION FROM EMPLEADO WHERE CLAVE = :clave`,
      [clave],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    if (dirResult.rows.length === 0) return res.status(404).send('Empleado no encontrado');
    const claveDireccion = dirResult.rows[0].CLAVE_DIRECCION;

    const estadoResult = await conn.execute(
      `SELECT CLAVE FROM CLAVE_ESTADO WHERE NOMBRE = :nombre`,
      [direccion.estado],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const claveEstado = estadoResult.rows[0]?.CLAVE;

    const rolResult = await conn.execute(
      `SELECT CLAVE FROM ROL WHERE NOMBRE = :nombre`,
      [rol],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const claveRol = rolResult.rows[0]?.CLAVE;

    await conn.execute(
      `UPDATE DIRECCION_EMPLEADO SET
        ESTADO = :ESTADO,
        MUNICIPIO = :MUNICIPIO,
        CP = :CP,
        COLONIA = :COLONIA,
        CALLE = :CALLE,
        NUM_INT = :NUM_INT,
        NUM_EXT = :NUM_EXT
      WHERE CLAVE = :CLAVE`,
      {
        ESTADO: claveEstado,
        MUNICIPIO: direccion.municipio || '',
        CP: direccion.cp ? Number(direccion.cp) : null,
        COLONIA: direccion.colonia || '',
        CALLE: direccion.calle || '',
        NUM_INT: direccion.num_int ? Number(direccion.num_int) : null,
        NUM_EXT: direccion.num_ext || '',
        CLAVE: claveDireccion
      }
    );

    await conn.execute(
      `UPDATE EMPLEADO SET 
        NOMBRE = :nombre,
        APELLIDO_PAT = :apellido_pat,
        APELLIDO_MAT = :apellido_mat,
        FECHA_NAC = TO_DATE(:fecha_nac, 'YYYY-MM-DD'),
        FECHA_REG = TO_DATE(:fecha_reg, 'YYYY-MM-DD'),
        TELEFONO = :telefono,
        CORREO = :correo,
        CLAVE_ROL = :claveRol
      WHERE CLAVE = :clave`,
      {
        nombre, apellido_pat, apellido_mat,
        fecha_nac, fecha_reg, telefono, correo,
        claveRol, clave
      },
      { autoCommit: true }
    );

    res.send('Empleado actualizado correctamente');

  } catch (err) {
    console.error('❌ Error al actualizar empleado:', err);
    res.status(500).send('Error al actualizar empleado');
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
    console.error('❌ Error al eliminar empleado:', err);
    res.status(500).send('Error al eliminar empleado');
  } finally {
    if (conn) await conn.close();
  }
};

module.exports = {
  getEmpleados,
  crearEmpleado,
  actualizarEmpleado,
  eliminarEmpleado
};
