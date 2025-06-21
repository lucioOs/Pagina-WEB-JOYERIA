const { getConnection } = require('../config/db');

// Obtener todas las promociones
const getPromociones = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.execute(
      `SELECT CLAVE, TO_CHAR(FECHA, 'YYYY-MM-DD') AS FECHA, DESCUENTO FROM PROMOCION ORDER BY CLAVE`,
      [],
      { outFormat: require('oracledb').OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener promociones:', error);
    res.status(500).json({ error: 'Error al obtener promociones' });
  }
};

// Crear promoción (sin generar la clave, lo hace el trigger)
const createPromocion = async (req, res) => {
  const { fecha, descuento } = req.body;
  try {
    const connection = await getConnection();
    await connection.execute(
      `INSERT INTO PROMOCION (FECHA, DESCUENTO) VALUES (TO_DATE(:fecha, 'YYYY-MM-DD'), :descuento)`,
      [fecha, descuento],
      { autoCommit: true }
    );
    res.status(201).json({ message: 'Promoción creada correctamente' });
  } catch (error) {
    console.error('Error al crear promoción:', error);
    res.status(500).json({ error: 'Error al crear promoción' });
  }
};

// Actualizar promoción
const updatePromocion = async (req, res) => {
  const clave = req.params.clave;
  const { fecha, descuento } = req.body;
  try {
    const connection = await getConnection();
    await connection.execute(
      `UPDATE PROMOCION SET FECHA = TO_DATE(:fecha, 'YYYY-MM-DD'), DESCUENTO = :descuento WHERE CLAVE = :clave`,
      [fecha, descuento, clave],
      { autoCommit: true }
    );
    res.json({ message: 'Promoción actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar promoción:', error);
    res.status(500).json({ error: 'Error al actualizar promoción' });
  }
};

// Eliminar promoción
const deletePromocion = async (req, res) => {
  const clave = req.params.clave;
  try {
    const connection = await getConnection();
    await connection.execute(
      `DELETE FROM PROMOCION WHERE CLAVE = :clave`,
      [clave],
      { autoCommit: true }
    );
    res.json({ message: 'Promoción eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar promoción:', error);
    res.status(500).json({ error: 'Error al eliminar promoción' });
  }
};

module.exports = {
  getPromociones,
  createPromocion,
  updatePromocion,
  deletePromocion,
};

