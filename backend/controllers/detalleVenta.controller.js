const { oracledb, getConnection } = require('../config/db');


// GET - Obtener todos los detalles de venta con info completa
const getAll = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `
      SELECT 
        dv.CLAVE_VENTA,
        dv.CLAVE_JOYA,
        dv.CANTIDAD,
        j.NOMBRE AS JOYA,
        j.PRECIO AS PRECIO_UNITARIO,
        (dv.CANTIDAD * j.PRECIO) AS TOTAL,
        v.FECHA,
        c.NOMBRE AS CLIENTE,
        e.NOMBRE AS EMPLEADO,
        s.NOMBRE AS SUCURSAL
      FROM DETALLE_VENTA dv
      JOIN JOYA j ON dv.CLAVE_JOYA = j.CLAVE
      JOIN VENTA v ON dv.CLAVE_VENTA = v.CLAVE
      JOIN CLIENTE c ON v.CLAVE_CLIENTE = c.CLAVE
      JOIN EMPLEADO e ON v.CLAVE_EMPLEADO = e.CLAVE
      JOIN SUCURSAL s ON v.CLAVE_SUCURSAL = s.CLAVE
      ORDER BY dv.CLAVE_VENTA
      `,
      [],
      { outFormat: require('oracledb').OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error al obtener detalles de venta:', err);
    res.status(500).json({ error: 'Error al obtener detalles de venta' });
  } finally {
    if (connection) await connection.close();
  }
};


// Obtener un detalle específico
const getById = async (req, res) => {
  const { clave_venta, clave_joya } = req.params;
  let connection;

  try {
    connection = await getConnection();

    const query = `
      SELECT * FROM DETALLE_VENTA
      WHERE CLAVE_VENTA = :clave_venta AND CLAVE_JOYA = :clave_joya`;

    const result = await connection.execute(
      query,
      { clave_venta, clave_joya },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Detalle no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error al obtener detalle por ID:', error);
    res.status(500).json({ error: 'Error al buscar el detalle' });
  } finally {
    if (connection) await connection.close();
  }
};

// Crear nuevo detalle
const create = async (req, res) => {
  const { CLAVE_VENTA, CLAVE_JOYA, CANTIDAD } = req.body;
  let connection;

  try {
    connection = await getConnection();

    const query = `
      INSERT INTO DETALLE_VENTA (CLAVE_VENTA, CLAVE_JOYA, CANTIDAD)
      VALUES (:CLAVE_VENTA, :CLAVE_JOYA, :CANTIDAD)`;

    await connection.execute(query, { CLAVE_VENTA, CLAVE_JOYA, CANTIDAD }, { autoCommit: true });

    res.status(201).json({ mensaje: '✅ Detalle de venta creado correctamente' });
  } catch (error) {
    console.error('❌ Error al crear detalle:', error);
    res.status(500).json({ error: 'Error al insertar el detalle' });
  } finally {
    if (connection) await connection.close();
  }
};

// Actualizar cantidad del detalle
const update = async (req, res) => {
  const { clave_venta, clave_joya } = req.params;
  const { CANTIDAD } = req.body;
  let connection;

  try {
    connection = await getConnection();

    const query = `
      UPDATE DETALLE_VENTA
      SET CANTIDAD = :CANTIDAD
      WHERE CLAVE_VENTA = :clave_venta AND CLAVE_JOYA = :clave_joya`;

    const result = await connection.execute(
      query,
      { CANTIDAD, clave_venta, clave_joya },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Detalle no encontrado' });
    }

    res.json({ mensaje: '✅ Detalle actualizado correctamente' });
  } catch (error) {
    console.error('❌ Error al actualizar detalle:', error);
    res.status(500).json({ error: 'Error al actualizar el detalle' });
  } finally {
    if (connection) await connection.close();
  }
};

// Eliminar un detalle
const remove = async (req, res) => {
  const { clave_venta, clave_joya } = req.params;
  let connection;

  try {
    connection = await getConnection();

    const query = `
      DELETE FROM DETALLE_VENTA
      WHERE CLAVE_VENTA = :clave_venta AND CLAVE_JOYA = :clave_joya`;

    const result = await connection.execute(
      query,
      { clave_venta, clave_joya },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Detalle no encontrado' });
    }

    res.json({ mensaje: '✅ Detalle eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar detalle:', error);
    res.status(500).json({ error: 'Error al eliminar el detalle' });
  } finally {
    if (connection) await connection.close();
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
