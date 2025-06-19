const express = require('express');
const router = express.Router();
const oracledb = require('oracledb'); // ✅ IMPORTACIÓN NECESARIA
const { getConnection } = require('../config/db');


// ✅ Obtener todo el inventario
// GET - Obtener todos los registros de INVENTARIO
router.get('/', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT * FROM INVENTARIO`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error en GET /api/inventario:', err);
    res.status(500).json({ error: 'Error al obtener inventario', detalle: err.message });
  } finally {
    if (connection) await connection.close();
  }
});


// ✅ Agregar inventario (POST)
router.post('/', async (req, res) => {
  const { CLAVE_JOYA, CLAVE_SUCURSAL, CANTIDAD } = req.body;
  let connection;
  try {
    connection = await getConnection();
    await connection.execute(
      `INSERT INTO INVENTARIO (CLAVE_JOYA, CLAVE_SUCURSAL, CANTIDAD)
       VALUES (:claveJoya, :claveSucursal, :cantidad)`,
      {
        claveJoya: CLAVE_JOYA,
        claveSucursal: CLAVE_SUCURSAL,
        cantidad: Number(CANTIDAD)
      },
      { autoCommit: true }
    );
    res.status(201).json({ message: 'Inventario agregado' });
  } catch (err) {
    console.error('Error al agregar inventario:', err);
    res.status(500).json({ error: 'Error al agregar inventario' });
  } finally {
    if (connection) await connection.close();
  }
});

// ✅ Actualizar inventario (PUT)
router.put('/:CLAVE_JOYA/:CLAVE_SUCURSAL', async (req, res) => {
  const { CLAVE_JOYA, CLAVE_SUCURSAL } = req.params;
  const { CANTIDAD } = req.body;

  let connection;
  try {
    connection = await getConnection();
    console.log('🟡 PUT body:', req.body);

    const result = await connection.execute(
      `UPDATE INVENTARIO
       SET CANTIDAD = :cantidad
       WHERE CLAVE_JOYA = :claveJoya AND CLAVE_SUCURSAL = :claveSucursal`,
      {
        cantidad: Number(CANTIDAD),
        claveJoya: CLAVE_JOYA,
        claveSucursal: CLAVE_SUCURSAL
      },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: 'Registro no encontrado para actualizar' });
    }

    res.json({ message: '✅ Cantidad actualizada correctamente' });
  } catch (err) {
    console.error('❌ Error al actualizar inventario:', err);
    res.status(500).json({ error: 'Error al actualizar inventario' });
  } finally {
    if (connection) await connection.close();
  }
});

// ✅ Eliminar inventario (DELETE)
router.delete('/:CLAVE_JOYA/:CLAVE_SUCURSAL', async (req, res) => {
  const { CLAVE_JOYA, CLAVE_SUCURSAL } = req.params;
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `DELETE FROM INVENTARIO
       WHERE CLAVE_JOYA = :claveJoya AND CLAVE_SUCURSAL = :claveSucursal`,
      {
        claveJoya: CLAVE_JOYA,
        claveSucursal: CLAVE_SUCURSAL
      },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: 'Registro no encontrado para eliminar' });
    }

    res.json({ message: 'Inventario eliminado' });
  } catch (err) {
    console.error('Error al eliminar inventario:', err);
    res.status(500).json({ error: 'Error al eliminar inventario' });
  } finally {
    if (connection) await connection.close();
  }
});

module.exports = router;
