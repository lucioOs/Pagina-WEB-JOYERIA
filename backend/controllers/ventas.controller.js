const { oracledb } = require('../config/db');

// Obtener todas las ventas
const getVentas = async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection();
    const result = await conn.execute(
      `SELECT 
  v.CLAVE,
  v.FECHA,
  c.NOMBRE || ' ' || c.APELLIDO_PAT AS CLIENTE,
  e.NOMBRE || ' ' || e.APELLIDO_PAT AS EMPLEADO,
  s.NOMBRE AS SUCURSAL
FROM VENTA v
JOIN CLIENTE c ON v.CLAVE_CLIENTE = c.CLAVE
JOIN EMPLEADO e ON v.CLAVE_EMPLEADO = e.CLAVE
JOIN SUCURSAL s ON v.CLAVE_SUCURSAL = s.CLAVE`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener ventas:', err);
    res.status(500).json({ error: 'Error al obtener ventas', details: err.message });
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.error('Error al cerrar conexión:', err);
      }
    }
  }
};

// Obtener una venta por clave
const getVentaPorClave = async (req, res) => {
  const { clave } = req.params;
  let conn;
  try {
    conn = await oracledb.getConnection();
    const result = await conn.execute(
      `SELECT v.CLAVE, v.FECHA,
              c.NOMBRE || ' ' || c.APELLIDO_PAT AS CLIENTE,
              e.NOMBRE || ' ' || e.APELLIDO_PAT AS EMPLEADO,
              s.NOMBRE AS SUCURSAL
       FROM VENTA v
       JOIN CLIENTE c ON v.CLAVE_CLIENTE = c.CLAVE
       JOIN EMPLEADO e ON v.CLAVE_EMPLEADO = e.CLAVE
       JOIN SUCURSAL s ON v.CLAVE_SUCURSAL = s.CLAVE
       WHERE v.CLAVE = :clave`,
      [clave],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Venta no encontrada' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error('Error al obtener venta:', err);
    res.status(500).json({ error: 'Error al obtener venta', details: err.message });
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.error('Error al cerrar conexión:', err);
      }
    }
  }
};

// Crear nueva venta
const crearVenta = async (req, res) => {
  const { CLAVE, FECHA, CLAVE_CLIENTE, CLAVE_EMPLEADO, CLAVE_METODO_PAGO, CLAVE_PROMOCION, CLAVE_SUCURSAL } = req.body;
  if (!CLAVE || !FECHA || !CLAVE_CLIENTE || !CLAVE_EMPLEADO || !CLAVE_METODO_PAGO || !CLAVE_SUCURSAL) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }
  let conn;
  try {
    conn = await oracledb.getConnection();
    await conn.execute(
      `INSERT INTO VENTA (CLAVE, FECHA, CLAVE_CLIENTE, CLAVE_EMPLEADO, CLAVE_METODO_PAGO, CLAVE_PROMOCION, CLAVE_SUCURSAL)
       VALUES (:CLAVE, TO_DATE(:FECHA, 'YYYY-MM-DD'), :CLAVE_CLIENTE, :CLAVE_EMPLEADO, :CLAVE_METODO_PAGO, :CLAVE_PROMOCION, :CLAVE_SUCURSAL)`,
      { CLAVE, FECHA, CLAVE_CLIENTE, CLAVE_EMPLEADO, CLAVE_METODO_PAGO, CLAVE_PROMOCION, CLAVE_SUCURSAL },
      { autoCommit: true }
    );
    res.status(201).json({ message: 'Venta creada exitosamente' });
  } catch (err) {
    console.error('Error al crear venta:', err);
    res.status(500).json({ error: 'Error al crear venta', details: err.message });
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.error('Error al cerrar conexión:', err);
      }
    }
  }
};

// Actualizar venta existente
const actualizarVenta = async (req, res) => {
  const { clave } = req.params;
  const { FECHA, CLAVE_CLIENTE, CLAVE_EMPLEADO, CLAVE_METODO_PAGO, CLAVE_PROMOCION, CLAVE_SUCURSAL } = req.body;
  if (!FECHA || !CLAVE_CLIENTE || !CLAVE_EMPLEADO || !CLAVE_METODO_PAGO || !CLAVE_SUCURSAL) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }
  let conn;
  try {
    conn = await oracledb.getConnection();
    const result = await conn.execute(
      `UPDATE VENTA SET 
         FECHA = TO_DATE(:FECHA, 'YYYY-MM-DD'),
         CLAVE_CLIENTE = :CLAVE_CLIENTE,
         CLAVE_EMPLEADO = :CLAVE_EMPLEADO,
         CLAVE_METODO_PAGO = :CLAVE_METODO_PAGO,
         CLAVE_PROMOCION = :CLAVE_PROMOCION,
         CLAVE_SUCURSAL = :CLAVE_SUCURSAL
       WHERE CLAVE = :clave`,
      { FECHA, CLAVE_CLIENTE, CLAVE_EMPLEADO, CLAVE_METODO_PAGO, CLAVE_PROMOCION, CLAVE_SUCURSAL, clave },
      { autoCommit: true }
    );
    if (result.rowsAffected === 0) {
      res.status(404).json({ error: 'Venta no encontrada' });
    } else {
      res.json({ message: 'Venta actualizada correctamente' });
    }
  } catch (err) {
    console.error('Error al actualizar venta:', err);
    res.status(500).json({ error: 'Error al actualizar venta', details: err.message });
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.error('Error al cerrar conexión:', err);
      }
    }
  }
};

// Eliminar venta
const eliminarVenta = async (req, res) => {
  const { clave } = req.params;
  let conn;
  try {
    conn = await oracledb.getConnection();
    const result = await conn.execute(
  `DELETE FROM VENTA WHERE CLAVE = :clave`
      [clave],
      { autoCommit: true }
    );
    if (result.rowsAffected === 0) {
      res.status(404).json({ error: 'Venta no encontrada' });
    } else {
      res.json({ message: 'Venta eliminada correctamente' });
    }
  } catch (err) {
    console.error('Error al eliminar venta:', err);
    res.status(500).json({ error: 'Error al eliminar venta', details: err.message });
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.error('Error al cerrar conexión:', err);
      }
    }
  }
};

module.exports = {
  getVentas,
  getVentaPorClave,
  crearVenta,
  actualizarVenta,
  eliminarVenta
};