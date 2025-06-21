const { oracledb } = require('../config/db');

// Obtener todas las direcciones
const getDireccionesClientes = async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection();
    const result = await conn.execute(
  `SELECT d.CLAVE, d.ESTADO, ce.NOMBRE AS NOMBRE_ESTADO,
          d.CP, d.COLONIA, d.CALLE,
          d.NUM_INT, d.NUM_EXT, d.CLIENTE_CLAVE,
          c.NOMBRE || ' ' || c.APELLIDO_PAT AS NOMBRE_CLIENTE
   FROM DIRECCION_CLIENTE d
   JOIN CLIENTE c ON d.CLIENTE_CLAVE = c.CLAVE
   JOIN CLAVE_ESTADO ce ON d.ESTADO = ce.CLAVE`,
  [],
  { outFormat: oracledb.OUT_FORMAT_OBJECT }
);

    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener direcciones:', err);
    res.status(500).json({ error: 'Error al obtener direcciones' });
  } finally {
    if (conn) await conn.close();
  }
};

// Crear una dirección
const crearDireccionCliente = async (req, res) => {
  let conn;
  const {
    ESTADO, CP, COLONIA, CALLE,
    NUM_INT, NUM_EXT, CLIENTE_CLAVE
  } = req.body;

  try {
    conn = await oracledb.getConnection();

    await conn.execute(
      `INSERT INTO DIRECCION_CLIENTE (
         CLAVE, ESTADO, CP, COLONIA, CALLE, NUM_INT, NUM_EXT, CLIENTE_CLAVE
       ) VALUES (
         SEQ_DIRECCION_CLIENTE.NEXTVAL, :ESTADO, :CP, :COLONIA, :CALLE, :NUM_INT, :NUM_EXT, :CLIENTE_CLAVE
       )`,
      {
        ESTADO, CP, COLONIA, CALLE, NUM_INT, NUM_EXT, CLIENTE_CLAVE
      },
      { autoCommit: true }
    );

    res.status(201).json({ message: 'Dirección creada correctamente' });
  } catch (err) {
    console.error('Error al crear dirección:', err);
    res.status(500).json({ error: 'Error al crear dirección' });
  } finally {
    if (conn) await conn.close();
  }
};

// Actualizar dirección
const actualizarDireccionCliente = async (req, res) => {
  let conn;
  const { clave } = req.params;
  const {
    ESTADO, MUNICIPIO, CP, COLONIA, CALLE,
    NUM_INT, NUM_EXT, CLIENTE_CLAVE
  } = req.body;
  try {
    conn = await oracledb.getConnection();
    await conn.execute(
      `UPDATE DIRECCION_CLIENTE
       SET ESTADO = :ESTADO,
           MUNICIPIO = :MUNICIPIO,
           CP = :CP,
           COLONIA = :COLONIA,
           CALLE = :CALLE,
           NUM_INT = :NUM_INT,
           NUM_EXT = :NUM_EXT,
           CLIENTE_CLAVE = :CLIENTE_CLAVE
       WHERE CLAVE = :CLAVE`,
      {
        ESTADO, MUNICIPIO, CP, COLONIA, CALLE,
        NUM_INT, NUM_EXT, CLIENTE_CLAVE, CLAVE: Number(clave)
      },
      { autoCommit: true }
    );
    res.json({ message: 'Dirección actualizada correctamente' });
  } catch (err) {
    console.error('Error al actualizar dirección:', err);
    res.status(500).json({ error: 'Error al actualizar dirección' });
  } finally {
    if (conn) await conn.close();
  }
};

// Eliminar dirección
const eliminarDireccionCliente = async (req, res) => {
  let conn;
  const { clave } = req.params;
  try {
    conn = await oracledb.getConnection();
    await conn.execute(
      `DELETE FROM DIRECCION_CLIENTE WHERE CLAVE = :CLAVE`,
      { CLAVE: Number(clave) },
      { autoCommit: true }
    );
    res.json({ message: 'Dirección eliminada correctamente' });
  } catch (err) {
    console.error('Error al eliminar dirección:', err);
    res.status(500).json({ error: 'Error al eliminar dirección' });
  } finally {
    if (conn) await conn.close();
  }
};

module.exports = {
  getDireccionesClientes,
  crearDireccionCliente,
  actualizarDireccionCliente,
  eliminarDireccionCliente
};
