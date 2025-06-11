const oracledb = require('oracledb');

const getEmpleados = async (req, res) => {
  let conexion;
  try {
    conexion = await oracledb.getConnection();
    const result = await conexion.execute(
      `SELECT 
  e.CLAVE, e.NOMBRE, e.APELLIDO_PAT, e.APELLIDO_MAT,
  e.CORREO, e.USUARIO, e.TELEFONO, e.FOTO,
  TO_CHAR(e.FECHA_NAC, 'YYYY-MM-DD') AS FECHA_NAC,
  TO_CHAR(e.FECHA_REG, 'YYYY-MM-DD') AS FECHA_REG,
  r.NOMBRE AS ROL
FROM EMPLEADO e
JOIN ROL r ON e.CLAVE_ROL = r.CLAVE`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener empleados:', err);
    res.status(500).send('Error al obtener empleados');
  } finally {
    if (conexion) await conexion.close();
  }
};

const getEmpleadoPorClave = async (req, res) => {
  const { clave } = req.params;
  let conexion;
  try {
    conexion = await oracledb.getConnection();
    const result = await conexion.execute(
      `SELECT 
         e.CLAVE, e.NOMBRE, e.APELLIDO_PAT, e.APELLIDO_MAT,
         TO_CHAR(e.FECHA_NAC, 'YYYY-MM-DD') AS FECHA_NAC,
         TO_CHAR(e.FECHA_REG, 'YYYY-MM-DD') AS FECHA_REG,
         e.TELEFONO, e.CORREO, e.FOTO, e.USUARIO,
         e.CLAVE_ROL, r.NOMBRE AS ROL
       FROM EMPLEADO e
       JOIN ROL r ON e.CLAVE_ROL = r.CLAVE
       WHERE e.CLAVE = :clave`,
      [clave],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al obtener empleado por clave:', err);
    res.status(500).send('Error del servidor');
  } finally {
    if (conexion) await conexion.close();
  }
};

const crearEmpleado = async (req, res) => {
  const {
    CLAVE, NOMBRE, APELLIDO_PAT, APELLIDO_MAT,
    FECHA_NAC, FECHA_REG, TELEFONO, CORREO,
    FOTO, USUARIO, CONTRASENA,
    CLAVE_ROL, CLAVE_DIRECCION
  } = req.body;

  let conexion;
  try {
    conexion = await oracledb.getConnection();

    await conexion.execute(
      `INSERT INTO EMPLEADO (
        CLAVE, NOMBRE, APELLIDO_PAT, APELLIDO_MAT,
        FECHA_NAC, FECHA_REG, TELEFONO, CORREO,
        FOTO, USUARIO, CONTRASENA,
        CLAVE_ROL, CLAVE_DIRECCION
      ) VALUES (
        :CLAVE, :NOMBRE, :APELLIDO_PAT, :APELLIDO_MAT,
        TO_DATE(:FECHA_NAC, 'YYYY-MM-DD'),
        TO_DATE(:FECHA_REG, 'YYYY-MM-DD'),
        :TELEFONO, :CORREO, :FOTO, :USUARIO, :CONTRASENA,
        :CLAVE_ROL, :CLAVE_DIRECCION
      )`,
      {
        CLAVE, NOMBRE, APELLIDO_PAT, APELLIDO_MAT,
        FECHA_NAC, FECHA_REG, TELEFONO, CORREO,
        FOTO, USUARIO, CONTRASENA,
        CLAVE_ROL, CLAVE_DIRECCION
      },
      { autoCommit: true }
    );

    res.status(201).json({ mensaje: 'Empleado creado correctamente' });
  } catch (err) {
    console.error('Error al crear empleado:', err);
    res.status(500).send('Error al crear empleado');
  } finally {
    if (conexion) await conexion.close();
  }
};

const actualizarEmpleado = async (req, res) => {
  const { clave } = req.params;
  const {
    NOMBRE, APELLIDO_PAT, APELLIDO_MAT,
    FECHA_NAC, FECHA_REG, TELEFONO, CORREO,
    FOTO, USUARIO, CONTRASENA,
    CLAVE_ROL, CLAVE_DIRECCION
  } = req.body;

  let conexion;
  try {
    conexion = await oracledb.getConnection();

    const result = await conexion.execute(
      `UPDATE EMPLEADO SET
        NOMBRE = :NOMBRE,
        APELLIDO_PAT = :APELLIDO_PAT,
        APELLIDO_MAT = :APELLIDO_MAT,
        FECHA_NAC = TO_DATE(:FECHA_NAC, 'YYYY-MM-DD'),
        FECHA_REG = TO_DATE(:FECHA_REG, 'YYYY-MM-DD'),
        TELEFONO = :TELEFONO,
        CORREO = :CORREO,
        FOTO = :FOTO,
        USUARIO = :USUARIO,
        CONTRASENA = :CONTRASENA,
        CLAVE_ROL = :CLAVE_ROL,
        CLAVE_DIRECCION = :CLAVE_DIRECCION
      WHERE CLAVE = :CLAVE`,
      {
        NOMBRE, APELLIDO_PAT, APELLIDO_MAT,
        FECHA_NAC, FECHA_REG, TELEFONO, CORREO,
        FOTO, USUARIO, CONTRASENA,
        CLAVE_ROL, CLAVE_DIRECCION,
        CLAVE: clave
      },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    }

    res.json({ mensaje: 'Empleado actualizado correctamente' });
  } catch (err) {
    console.error('Error al actualizar empleado:', err);
    res.status(500).send('Error al actualizar empleado');
  } finally {
    if (conexion) await conexion.close();
  }
};

const eliminarEmpleado = async (req, res) => {
  const { clave } = req.params;
  let conexion;
  try {
    conexion = await oracledb.getConnection();
    const result = await conexion.execute(
      `DELETE FROM EMPLEADO WHERE CLAVE = :CLAVE`,
      [clave],
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    }

    res.json({ mensaje: 'Empleado eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar empleado:', err);
    res.status(500).send('Error al eliminar empleado');
  } finally {
    if (conexion) await conexion.close();
  }
};



module.exports = {
  getEmpleados,
  getEmpleadoPorClave,
  crearEmpleado,
  actualizarEmpleado,
  eliminarEmpleado // 👈 este nuevo
};
