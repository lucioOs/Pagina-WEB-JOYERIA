const express = require('express');
const router = express.Router();
const { oracledb, getConnection } = require('../config/db');

// Obtener todos los roles
router.get('/', async (req, res) => {
  try {
    const conn = await getConnection();
    const result = await conn.execute(`SELECT CLAVE, NOMBRE FROM ROL`, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT
    });
    await conn.close();
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener roles:', err);
    res.status(500).json({ mensaje: 'Error al obtener roles' });
  }
});

// Crear nuevo rol
router.post('/', async (req, res) => {
  const { NOMBRE } = req.body;
  try {
    const conn = await getConnection();
    await conn.execute(
      `INSERT INTO ROL (CLAVE, NOMBRE) VALUES (SEQ_ROL.NEXTVAL, :NOMBRE)`,
      [NOMBRE],
      { autoCommit: true }
    );
    await conn.close();
    res.status(201).json({ mensaje: 'Rol creado exitosamente' });
  } catch (err) {
    console.error('Error al crear rol:', err);
    res.status(500).json({ mensaje: 'Error al crear rol' });
  }
});

// Actualizar un rol
router.put('/:clave', async (req, res) => {
  const { clave } = req.params;
  const { NOMBRE } = req.body;
  try {
    const conn = await getConnection();
    await conn.execute(
      `UPDATE ROL SET NOMBRE = :NOMBRE WHERE CLAVE = :CLAVE`,
      { NOMBRE, CLAVE: clave },
      { autoCommit: true }
    );
    await conn.close();
    res.json({ mensaje: 'Rol actualizado correctamente' });
  } catch (err) {
    console.error('Error al actualizar rol:', err);
    res.status(500).json({ mensaje: 'Error al actualizar rol' });
  }
});

// Eliminar un rol
router.delete('/:clave', async (req, res) => {
  const { clave } = req.params;
  try {
    const conn = await getConnection();
    await conn.execute(
      `DELETE FROM ROL WHERE CLAVE = :CLAVE`,
      [clave],
      { autoCommit: true }
    );
    await conn.close();
    res.json({ mensaje: 'Rol eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar rol:', err);
    if (err.errorNum === 2292) {
      res.status(409).json({ mensaje: 'No se puede eliminar el rol porque está en uso' });
    } else {
      res.status(500).json({ mensaje: 'Error al eliminar rol' });
    }
  }
});

module.exports = router;
