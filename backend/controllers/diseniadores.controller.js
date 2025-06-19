const { oracledb } = require('../config/db');

// Obtener todos los diseñadores
const obtenerDiseniadores = async (req, res) => {
  let conexion;
  try {
    conexion = await oracledb.getConnection();
    const result = await conexion.execute(
      `SELECT CLAVE, NOMBRE || ' ' || AP_PAT AS NOMBRE_COMPLETO FROM DISENIADOR`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error al obtener diseñadores:", error);
    res.status(500).send("Error al obtener diseñadores");
  } finally {
    if (conexion) await conexion.close();
  }
};

// Obtener diseñador por clave
const obtenerDiseniadorPorClave = async (req, res) => {
  const { clave } = req.params;
  let conexion;
  try {
    conexion = await oracledb.getConnection();
    const result = await conexion.execute(
      `SELECT CLAVE, NOMBRE, AP_PAT FROM DISENIADOR WHERE CLAVE = :clave`,
      [clave],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Diseñador no encontrado");
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error al obtener diseñador:", error);
    res.status(500).send("Error al obtener diseñador");
  } finally {
    if (conexion) await conexion.close();
  }
};

// Crear diseñador
const crearDiseniador = async (req, res) => {
  const { clave, nombre, ap_pat } = req.body;
  try {
    const conexion = await oracledb.getConnection();
    await conexion.execute(
      `INSERT INTO DISENIADOR (CLAVE, NOMBRE, AP_PAT) VALUES (:clave, :nombre, :ap_pat)`,
      { clave, nombre, ap_pat },
      { autoCommit: true }
    );
    res.status(201).send("Diseñador creado correctamente");
  } catch (error) {
    console.error("❌ Error al crear diseñador:", error);
    res.status(500).send("Error al crear diseñador");
  }
};

// Actualizar diseñador
const actualizarDiseniador = async (req, res) => {
  const { clave } = req.params;
  const { nombre, ap_pat } = req.body;
  try {
    const conexion = await oracledb.getConnection();
    const result = await conexion.execute(
      `UPDATE DISENIADOR SET NOMBRE = :nombre, AP_PAT = :ap_pat WHERE CLAVE = :clave`,
      { nombre, ap_pat, clave },
      { autoCommit: true }
    );
    if (result.rowsAffected === 0) {
      res.status(404).send("Diseñador no encontrado");
    } else {
      res.send("Diseñador actualizado correctamente");
    }
  } catch (error) {
    console.error("❌ Error al actualizar diseñador:", error);
    res.status(500).send("Error al actualizar diseñador");
  }
};

// Eliminar diseñador
const eliminarDiseniador = async (req, res) => {
  const { clave } = req.params;
  try {
    const conexion = await oracledb.getConnection();
    const result = await conexion.execute(
      `DELETE FROM DISENIADOR WHERE CLAVE = :clave`,
      [clave],
      { autoCommit: true }
    );
    if (result.rowsAffected === 0) {
      res.status(404).send("Diseñador no encontrado");
    } else {
      res.send("Diseñador eliminado correctamente");
    }
  } catch (error) {
    console.error("❌ Error al eliminar diseñador:", error);
    res.status(500).send("Error al eliminar diseñador");
  }
};

module.exports = {
  obtenerDiseniadores,
  obtenerDiseniadorPorClave,
  crearDiseniador,
  actualizarDiseniador,
  eliminarDiseniador
};
