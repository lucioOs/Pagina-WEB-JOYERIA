const { oracledb } = require('../config/db');

function createCrudHandlers(tableName, primaryKeys) {
  const upperTable = tableName.toUpperCase();

  const getAll = async (req, res) => {
    let conn;
    try {
      conn = await oracledb.getConnection();
      const result = await conn.execute(`SELECT * FROM ${upperTable}`, [], {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      });
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al obtener registros');
    } finally {
      if (conn) await conn.close();
    }
  };

  const getById = async (req, res) => {
    let conn;
    try {
      conn = await oracledb.getConnection();
      const where = primaryKeys.map(pk => `${pk} = :${pk}`).join(' AND ');
      const params = {};
      primaryKeys.forEach(pk => {
        params[pk] = req.params[pk.toLowerCase()];
      });
      const result = await conn.execute(
        `SELECT * FROM ${upperTable} WHERE ${where}`,
        params,
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      if (result.rows.length === 0) {
        res.status(404).send('Registro no encontrado');
      } else {
        res.json(result.rows[0]);
      }
    } catch (err) {
      res.status(500).send('Error al obtener registro');
    } finally {
      if (conn) await conn.close();
    }
  };

  const create = async (req, res) => {
    let conn;
    try {
      conn = await oracledb.getConnection();
      const cols = Object.keys(req.body);
      if (cols.length === 0) {
        return res.status(400).send('No hay datos para insertar');
      }
      const placeholders = cols.map(c => `:${c}`).join(', ');
      const query = `INSERT INTO ${upperTable} (${cols.join(', ')}) VALUES (${placeholders})`;
      await conn.execute(query, req.body, { autoCommit: true });
      res.status(201).send('Registro creado');
    } catch (err) {
      res.status(500).send('Error al crear registro: ' + err.message);
    } finally {
      if (conn) await conn.close();
    }
  };

  const update = async (req, res) => {
    let conn;
    try {
      conn = await oracledb.getConnection();
      const cols = Object.keys(req.body).filter(c => !primaryKeys.includes(c));
      if (cols.length === 0) {
        return res.status(400).send('No hay datos para actualizar');
      }
      const setClause = cols.map(c => `${c} = :${c}`).join(', ');
      const where = primaryKeys.map(pk => `${pk} = :${pk}`).join(' AND ');
      const params = { ...req.body };
      primaryKeys.forEach(pk => {
        params[pk] = req.params[pk.toLowerCase()];
      });
      const query = `UPDATE ${upperTable} SET ${setClause} WHERE ${where}`;
      const result = await conn.execute(query, params, { autoCommit: true });
      if (result.rowsAffected === 0) {
        res.status(404).send('Registro no encontrado');
      } else {
        res.send('Registro actualizado');
      }
    } catch (err) {
      res.status(500).send('Error al actualizar registro: ' + err.message);
    } finally {
      if (conn) await conn.close();
    }
  };

  const remove = async (req, res) => {
    let conn;
    try {
      conn = await oracledb.getConnection();
      const where = primaryKeys.map(pk => `${pk} = :${pk}`).join(' AND ');
      const params = {};
      primaryKeys.forEach(pk => {
        params[pk] = req.params[pk.toLowerCase()];
      });
      const query = `DELETE FROM ${upperTable} WHERE ${where}`;
      const result = await conn.execute(query, params, { autoCommit: true });
      if (result.rowsAffected === 0) {
        res.status(404).send('Registro no encontrado');
      } else {
        res.send('Registro eliminado');
      }
    } catch (err) {
      res.status(500).send('Error al eliminar registro: ' + err.message);
    } finally {
      if (conn) await conn.close();
    }
  };

  return { getAll, getById, create, update, remove };
}

module.exports = createCrudHandlers;
