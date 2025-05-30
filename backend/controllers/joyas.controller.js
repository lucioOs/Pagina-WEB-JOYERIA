const { oracledb } = require('../config/db');

// Obtener todas las joyas
const getJoyas = async (req, res) => {
  let conexion;
  try {
    conexion = await oracledb.getConnection();
    const result = await conexion.execute(`SELECT * FROM JOYA`, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener joyas');
  } finally {
    if (conexion) await conexion.close();
  }
};

// Obtener una joya por clave
const getJoyaPorClave = async (req, res) => {
  let conexion;
  const { clave } = req.params;
  try {
    conexion = await oracledb.getConnection();
    const result = await conexion.execute(
      `SELECT * FROM JOYA WHERE CLAVE = :clave`,
      [clave],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    if (result.rows.length === 0) {
      res.status(404).send('Joya no encontrada');
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    res.status(500).send('Error al buscar joya');
  } finally {
    if (conexion) await conexion.close();
  }
};

// Insertar una nueva joya
const crearJoya = async (req, res) => {
  const { nombre, descripcion, precio, inventario, tipo, material } = req.body;

  if (
    !nombre || nombre.trim() === '' ||
    !descripcion || descripcion.trim() === '' ||
    precio == null || isNaN(precio) || precio <= 0 ||
    inventario == null || isNaN(inventario) || inventario < 0 ||
    tipo == null || isNaN(tipo) ||
    material == null || isNaN(material)
  ) {
    return res.status(400).send('❌ Datos inválidos. Verifica nombre, descripción, precio (>0), inventario (≥0), tipo y material.');
  }

  let conexion;
  try {
    conexion = await oracledb.getConnection();
    await conexion.execute(
      `INSERT INTO JOYA (NOMBRE, DESCRIPCION, PRECIO, INVENTARIO, TIPO, MATERIAL)
       VALUES (:nombre, :descripcion, :precio, :inventario, :tipo, :material)`,
      { nombre, descripcion, precio, inventario, tipo, material },
      { autoCommit: true }
    );
    res.status(201).send('✅ Joya insertada correctamente');
  } catch (err) {
    res.status(500).send('Error al insertar joya: ' + err.message);
  } finally {
    if (conexion) await conexion.close();
  }
};

// Actualizar joya existente
const actualizarJoya = async (req, res) => {
  const { clave } = req.params;
  const { nombre, descripcion, precio, inventario, tipo, material } = req.body;

  if (
    !nombre || nombre.trim() === '' ||
    !descripcion || descripcion.trim() === '' ||
    precio == null || isNaN(precio) || precio <= 0 ||
    inventario == null || isNaN(inventario) || inventario < 0 ||
    tipo == null || isNaN(tipo) ||
    material == null || isNaN(material)
  ) {
    return res.status(400).send('❌ Datos inválidos. Verifica nombre, descripción, precio (>0), inventario (≥0), tipo y material.');
  }

  let conexion;
  try {
    conexion = await oracledb.getConnection();
    const result = await conexion.execute(
      `UPDATE JOYA
       SET NOMBRE = :nombre,
           DESCRIPCION = :descripcion,
           PRECIO = :precio,
           INVENTARIO = :inventario,
           TIPO = :tipo,
           MATERIAL = :material
       WHERE CLAVE = :clave`,
      { nombre, descripcion, precio, inventario, tipo, material, clave },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      res.status(404).send('❌ Joya no encontrada');
    } else {
      res.send('✅ Joya actualizada correctamente');
    }

  } catch (err) {
    res.status(500).send('Error al actualizar joya: ' + err.message);
  } finally {
    if (conexion) await conexion.close();
  }
};

// Eliminar joya por clave
const eliminarJoya = async (req, res) => {
  const { clave } = req.params;
  let conexion;
  try {
    conexion = await oracledb.getConnection();
    const result = await conexion.execute(
      `DELETE FROM JOYA WHERE CLAVE = :clave`,
      [clave],
      { autoCommit: true }
    );
    if (result.rowsAffected === 0) {
      res.status(404).send('❌ Joya no encontrada');
    } else {
      res.send('✅ Joya eliminada correctamente');
    }
  } catch (err) {
    res.status(500).send('Error al eliminar joya: ' + err.message);
  } finally {
    if (conexion) await conexion.close();
  }
};

const obtenerTipos = async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection();
    const result = await conn.execute(`SELECT CLAVE, NOMBRE FROM TIPO_JOYA`, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Error al obtener tipos');
  } finally {
    if (conn) await conn.close();
  }
};

const obtenerMateriales = async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection();
    const result = await conn.execute(`SELECT CLAVE, NOMBRE FROM MATERIAL`, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Error al obtener materiales');
  } finally {
    if (conn) await conn.close();
  }
};



module.exports = {
  getJoyas,
  getJoyaPorClave,
  crearJoya,
  actualizarJoya,
  eliminarJoya,
  obtenerTipos,
  obtenerMateriales
};
