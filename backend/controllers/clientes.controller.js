// controllers/Clientes.controller.js
const { oracledb } = require('../config/db');

// Obtener todos los clientes
const getClientes = async (req, res) => {
  let conexion;
  try {
    conexion = await oracledb.getConnection();
    const result = await conexion.execute(`SELECT * FROM CLIENTE`, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener clientes');
  } finally {
    if (conexion) await conexion.close();
  }
};

// Obtener un cliente por clave
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

// Crear un nuevo cliente
const crearCliente = async (req, res) => {
  const {
    clave, nombre, apellido_pat, apellido_mat,
    fecha_nac, fecha_reg, telefono, correo, foto, clave_direccion
  } = req.body;

  let conexion;
  try {
    conexion = await oracledb.getConnection();
    await conexion.execute(
      `INSERT INTO CLIENTE (CLAVE, NOMBRE, APELLIDO_PAT, APELLIDO_MAT, FECHA_NAC, FECHA_REG, TELEFONO, CORREO, FOTO, CLAVE_DIRECCION)
       VALUES (:clave, :nombre, :apellido_pat, :apellido_mat, TO_DATE(:fecha_nac, 'YYYY-MM-DD'), TO_DATE(:fecha_reg, 'YYYY-MM-DD'), :telefono, :correo, :foto, :clave_direccion)`,
      { clave, nombre, apellido_pat, apellido_mat, fecha_nac, fecha_reg, telefono, correo, foto, clave_direccion },
      { autoCommit: true }
    );
    res.status(201).send('Cliente creado correctamente');
  } catch (err) {
    res.status(500).send('Error al crear cliente: ' + err.message);
  } finally {
    if (conexion) await conexion.close();
  }
};

// Actualizar un cliente existente
const actualizarCliente = async (req, res) => {
  const { clave } = req.params;
  const {
    nombre, apellido_pat, apellido_mat,
    fecha_nac, fecha_reg, telefono, correo, foto, clave_direccion
  } = req.body;

  let conexion;
  try {
    conexion = await oracledb.getConnection();
    const result = await conexion.execute(
      `UPDATE CLIENTE SET 
        NOMBRE = :nombre,
        APELLIDO_PAT = :apellido_pat,
        APELLIDO_MAT = :apellido_mat,
        FECHA_NAC = TO_DATE(:fecha_nac, 'YYYY-MM-DD'),
        FECHA_REG = TO_DATE(:fecha_reg, 'YYYY-MM-DD'),
        TELEFONO = :telefono,
        CORREO = :correo,
        FOTO = :foto,
        CLAVE_DIRECCION = :clave_direccion
       WHERE CLAVE = :clave`,
      { nombre, apellido_pat, apellido_mat, fecha_nac, fecha_reg, telefono, correo, foto, clave_direccion, clave },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      res.status(404).send('Cliente no encontrado');
    } else {
      res.send('Cliente actualizado correctamente');
    }
  } catch (err) {
    res.status(500).send('Error al actualizar cliente: ' + err.message);
  } finally {
    if (conexion) await conexion.close();
  }
};

// Eliminar cliente
const eliminarCliente = async (req, res) => {
  const { clave } = req.params;
  let conexion;

  try {
    conexion = await oracledb.getConnection();
    const result = await conexion.execute(
      `DELETE FROM CLIENTE WHERE CLAVE = :clave`,
      [clave],
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      res.status(404).send('❌ Cliente no encontrado');
    } else {
      res.send('✅ Cliente eliminado correctamente');
    }
  } catch (err) {
  console.error('Error detallado:', err);
  res.status(500).send('Error al eliminar cliente: ' + err.message);
}
  } finally {
    if (conexion) await conexion.close();
  }
};


module.exports = {
  getClientes,
  getClientePorClave,
  crearCliente,
  actualizarCliente,
  eliminarCliente
};
