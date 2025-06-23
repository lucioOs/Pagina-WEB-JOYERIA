const { oracledb } = require('../config/db');

// Obtener todos los clientes con su dirección
const getClientes = async (req, res) => {
  let conexion;
  try {
    conexion = await oracledb.getConnection();
    const result = await conexion.execute(`
      SELECT 
        c.CLAVE, c.NOMBRE, c.APELLIDO_PAT, c.APELLIDO_MAT, 
        c.FECHA_NAC, c.FECHA_REG, c.TELEFONO, c.CORREO, c.FOTO,
        d.ESTADO AS ESTADO_CLAVE, e.NOMBRE AS ESTADO,
        d.MUNICIPIO, d.CP, d.COLONIA, d.CALLE, d.NUM_INT, d.NUM_EXT
      FROM CLIENTE c
      JOIN DIRECCION_CLIENTE d ON c.CLAVE_DIRECCION = d.CLAVE
      JOIN CLAVE_ESTADO e ON d.ESTADO = e.CLAVE
    `, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error al obtener clientes con dirección:', err);
    res.status(500).send('Error al obtener clientes');
  } finally {
    if (conexion) await conexion.close();
  }
};

// Obtener cliente por clave
const getClientePorClave = async (req, res) => {
  const { clave } = req.params;
  let conexion;
  try {
    conexion = await oracledb.getConnection();
    const result = await conexion.execute(
      `SELECT * FROM CLIENTE WHERE CLAVE = :clave`,
      [clave],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    if (result.rows.length === 0) {
      res.status(404).send('Cliente no encontrado');
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    res.status(500).send('Error al buscar cliente');
  } finally {
    if (conexion) await conexion.close();
  }
};

// Crear nuevo cliente con dirección
const crearCliente = async (req, res) => {
  const conn = await oracledb.getConnection();
  try {
    const {
      nombre, apellido_pat, apellido_mat, fecha_nac,
      fecha_reg, telefono, correo, foto,
      direccion
    } = req.body;

    // 1. Insertar dirección (no incluimos CLAVE, trigger lo genera)
    await conn.execute(
      `INSERT INTO DIRECCION_CLIENTE (
        ESTADO, MUNICIPIO, CP, COLONIA, CALLE, NUM_INT, NUM_EXT
      ) VALUES (
        :ESTADO, :MUNICIPIO, :CP, :COLONIA, :CALLE, :NUM_INT, :NUM_EXT
      )`,
      {
        ESTADO: direccion.estado,
        MUNICIPIO: direccion.municipio || '',
        CP: Number(direccion.cp),
        COLONIA: direccion.colonia || '',
        CALLE: direccion.calle || '',
        NUM_INT: Number(direccion.num_int),
        NUM_EXT: direccion.num_ext || ''
      }
    );

    // 2. Obtener la última clave insertada (por trigger)
    const dirResult = await conn.execute(
      `SELECT MAX(CLAVE) AS CLAVE FROM DIRECCION_CLIENTE`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const claveDireccion = dirResult.rows[0].CLAVE;

    // 3. Insertar cliente con la clave de dirección
    await conn.execute(
      `INSERT INTO CLIENTE (
        NOMBRE, APELLIDO_PAT, APELLIDO_MAT, FECHA_NAC,
        FECHA_REG, TELEFONO, CORREO, FOTO, CLAVE_DIRECCION
      ) VALUES (
        :nombre, :apellido_pat, :apellido_mat, TO_DATE(:fecha_nac, 'YYYY-MM-DD'),
        TO_DATE(:fecha_reg, 'YYYY-MM-DD'), :telefono, :correo, :foto, :claveDireccion
      )`,
      {
        nombre, apellido_pat, apellido_mat,
        fecha_nac, fecha_reg, telefono, correo, foto,
        claveDireccion
      },
      { autoCommit: true }
    );

    res.status(201).json({ message: 'Cliente y dirección registrados correctamente' });

  } catch (err) {
    console.error('❌ Error al insertar cliente con dirección:', err);
    res.status(500).send('Error al registrar cliente');
  } finally {
    if (conn) await conn.close();
  }
};

// Actualizar cliente y su dirección
const actualizarCliente = async (req, res) => {
  const { clave } = req.params;
  const {
    nombre, apellido_pat, apellido_mat,
    fecha_nac, fecha_reg, telefono, correo,
    direccion
  } = req.body;

  let conn;
  try {
    conn = await oracledb.getConnection();

    const dir = await conn.execute(
      `SELECT CLAVE_DIRECCION FROM CLIENTE WHERE CLAVE = :clave`,
      [clave],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (dir.rows.length === 0) return res.status(404).send('Cliente no encontrado');
    const claveDireccion = dir.rows[0].CLAVE_DIRECCION;

    await conn.execute(
      `UPDATE DIRECCION_CLIENTE SET
        ESTADO = :ESTADO,
        MUNICIPIO = :MUNICIPIO,
        CP = :CP,
        COLONIA = :COLONIA,
        CALLE = :CALLE,
        NUM_INT = :NUM_INT,
        NUM_EXT = :NUM_EXT
      WHERE CLAVE = :CLAVE`,
      {
        ESTADO: direccion.estado,
        MUNICIPIO: direccion.municipio || '',
        CP: Number(direccion.cp),
        COLONIA: direccion.colonia || '',
        CALLE: direccion.calle || '',
        NUM_INT: Number(direccion.num_int),
        NUM_EXT: direccion.num_ext || '',
        CLAVE: claveDireccion
      }
    );

    await conn.execute(
      `UPDATE CLIENTE SET 
        NOMBRE = :nombre,
        APELLIDO_PAT = :apellido_pat,
        APELLIDO_MAT = :apellido_mat,
        FECHA_NAC = TO_DATE(:fecha_nac, 'YYYY-MM-DD'),
        FECHA_REG = TO_DATE(:fecha_reg, 'YYYY-MM-DD'),
        TELEFONO = :telefono,
        CORREO = :correo
      WHERE CLAVE = :clave`,
      {
        nombre, apellido_pat, apellido_mat,
        fecha_nac, fecha_reg, telefono, correo,
        clave
      },
      { autoCommit: true }
    );

    res.send('Cliente actualizado correctamente');
  } catch (err) {
    console.error('❌ Error al actualizar cliente:', err);
    res.status(500).send('Error al actualizar cliente');
  } finally {
    if (conn) await conn.close();
  }
};

// Eliminar cliente
const eliminarCliente = async (req, res) => {
  const { clave } = req.params;
  let conn;
  try {
    conn = await oracledb.getConnection();

    const result = await conn.execute(
      `DELETE FROM CLIENTE WHERE CLAVE = :clave`,
      [clave],
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      res.status(404).send('Cliente no encontrado');
    } else {
      res.send('Cliente eliminado correctamente');
    }

  } catch (err) {
    console.error('❌ Error al eliminar cliente:', err);
    res.status(500).send('Error al eliminar cliente');
  } finally {
    if (conn) await conn.close();
  }
};

module.exports = {
  getClientes,
  getClientePorClave,
  crearCliente,
  actualizarCliente,
  eliminarCliente
};
