const { oracledb } = require('../config/db');

// Obtener todos los métodos de pago
const getMetodosPago = async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection();
    const result = await conn.execute(
      `SELECT CLAVE, NOMBRE FROM METODO_PAGO ORDER BY CLAVE`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Error al obtener métodos de pago');
  } finally {
    if (conn) await conn.close();
  }
};

// Obtener uno por clave
const getMetodoPagoPorClave = async (req, res) => {
  const { clave } = req.params;
  let conn;
  try {
    conn = await oracledb.getConnection();
    const result = await conn.execute(
      `SELECT CLAVE, NOMBRE FROM METODO_PAGO WHERE CLAVE = :clave`,
      [clave],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    if (result.rows.length === 0) {
      res.status(404).send('Método de pago no encontrado');
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    res.status(500).send('Error al buscar método de pago');
  } finally {
    if (conn) await conn.close();
  }
};

// Crear nuevo método de pago
const crearMetodoPago = async (req, res) => {
  const { CLAVE, NOMBRE } = req.body;
  if (!CLAVE || !NOMBRE) {
    return res.status(400).send('Faltan datos obligatorios');
  }

  let conn;
  try {
    conn = await oracledb.getConnection();
    await conn.execute(
      `INSERT INTO METODO_PAGO (CLAVE, NOMBRE) VALUES (:CLAVE, :NOMBRE)`,
      { CLAVE, NOMBRE },
      { autoCommit: true }
    );
    res.status(201).send('Método de pago creado correctamente');
  } catch (err) {
    res.status(500).send('Error al crear método de pago: ' + err.message);
  } finally {
    if (conn) await conn.close();
  }
};

// Actualizar método de pago
const actualizarMetodoPago = async (req, res) => {
  const { clave } = req.params;
  const { NOMBRE } = req.body;
  if (!NOMBRE) {
    return res.status(400).send('El nombre es obligatorio');
  }

  let conn;
  try {
    conn = await oracledb.getConnection();
    const result = await conn.execute(
      `UPDATE METODO_PAGO SET NOMBRE = :NOMBRE WHERE CLAVE = :clave`,
      { NOMBRE, clave },
      { autoCommit: true }
    );
    if (result.rowsAffected === 0) {
      res.status(404).send('Método de pago no encontrado');
    } else {
      res.send('Método de pago actualizado correctamente');
    }
  } catch (err) {
    res.status(500).send('Error al actualizar método de pago: ' + err.message);
  } finally {
    if (conn) await conn.close();
  }
};

// Eliminar
const eliminarMetodoPago = async (req, res) => {
  const { clave } = req.params;

  let conn;
  try {
    conn = await oracledb.getConnection();
    const result = await conn.execute(
      `DELETE FROM METODO_PAGO WHERE CLAVE = :clave`,
      [clave],
      { autoCommit: true }
    );
    if (result.rowsAffected === 0) {
      res.status(404).send('Método de pago no encontrado');
    } else {
      res.send('Método de pago eliminado correctamente');
    }
  } catch (err) {
    res.status(500).send('Error al eliminar método de pago: ' + err.message);
  } finally {
    if (conn) await conn.close();
  }
};

module.exports = {
  getMetodosPago,
  getMetodoPagoPorClave,
  crearMetodoPago,
  actualizarMetodoPago,
  eliminarMetodoPago
};
