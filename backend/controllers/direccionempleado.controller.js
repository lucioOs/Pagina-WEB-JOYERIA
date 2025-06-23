const { oracledb } = require('../config/db');

// ✅ Obtener direcciones de empleados
const obtenerDirecciones = async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection();
    const result = await conn.execute(
      `SELECT 
        de.CLAVE,
        e.NOMBRE || ' ' || e.APELLIDO_PAT || ' ' || e.APELLIDO_MAT AS EMPLEADO,
        ce.NOMBRE AS ESTADO,
        de.MUNICIPIO,
        de.CP,
        de.COLONIA,
        de.CALLE,
        de.NUM_INT,
        de.NUM_EXT,
        de.CLAVE_EMPLEADO
      FROM DIRECCION_EMPLEADO de
      JOIN EMPLEADO e ON de.CLAVE_EMPLEADO = e.CLAVE
      JOIN CLAVE_ESTADO ce ON de.ESTADO = ce.CLAVE`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error al obtener direcciones con JOIN:', err);
    res.status(500).send('Error al obtener direcciones');
  } finally {
    if (conn) await conn.close();
  }
};

// ✅ Crear nueva dirección
// ✅ Crear nueva dirección (USANDO TRIGGER)
const crearDireccion = async (req, res) => {
  let conn;
  const {
    ESTADO, MUNICIPIO, CP, COLONIA, CALLE,
    NUM_INT, NUM_EXT, CLAVE_EMPLEADO
  } = req.body;

  try {
    // Validación básica
    if (!CLAVE_EMPLEADO || isNaN(Number(CLAVE_EMPLEADO))) {
      return res.status(400).json({ error: 'CLAVE_EMPLEADO debe ser un número válido' });
    }

    conn = await oracledb.getConnection();
    await conn.execute(
      `INSERT INTO DIRECCION_EMPLEADO (
        ESTADO, MUNICIPIO, CP, COLONIA,
        CALLE, NUM_INT, NUM_EXT, CLAVE_EMPLEADO
      ) VALUES (
        :ESTADO, :MUNICIPIO, :CP, :COLONIA,
        :CALLE, :NUM_INT, :NUM_EXT, :CLAVE_EMPLEADO
      )`,
      {
        ESTADO,
        MUNICIPIO: MUNICIPIO || '',
        CP: Number(CP),
        COLONIA: COLONIA || '',
        CALLE: CALLE || '',
        NUM_INT: Number(NUM_INT),
        NUM_EXT: NUM_EXT || '',
        CLAVE_EMPLEADO: Number(CLAVE_EMPLEADO)
      },
      { autoCommit: true }
    );

    res.status(201).json({ message: 'Dirección creada correctamente' });
  } catch (err) {
    console.error('❌ Error al crear dirección de empleado:', err);
    res.status(500).send('Error al crear dirección');
  } finally {
    if (conn) await conn.close();
  }
};


// ✅ Actualizar dirección existente
const actualizarDireccion = async (req, res) => {
  let conn;
  const clave = req.params.id;
  const {
    ESTADO, MUNICIPIO, CP, COLONIA, CALLE,
    NUM_INT, NUM_EXT, CLAVE_EMPLEADO
  } = req.body;

  try {
    conn = await oracledb.getConnection();
    await conn.execute(
      `UPDATE DIRECCION_EMPLEADO SET
        ESTADO = :ESTADO,
        MUNICIPIO = :MUNICIPIO,
        CP = :CP,
        COLONIA = :COLONIA,
        CALLE = :CALLE,
        NUM_INT = :NUM_INT,
        NUM_EXT = :NUM_EXT,
        CLAVE_EMPLEADO = :CLAVE_EMPLEADO
      WHERE CLAVE = :CLAVE`,
      {
        ESTADO,
        MUNICIPIO: MUNICIPIO || '',
        CP: Number(CP),
        COLONIA: COLONIA || '',
        CALLE: CALLE || '',
        NUM_INT: Number(NUM_INT),
        NUM_EXT: NUM_EXT || '',
        CLAVE_EMPLEADO: Number(CLAVE_EMPLEADO),
        CLAVE: Number(clave)
      },
      { autoCommit: true }
    );

    res.json({ message: 'Dirección actualizada correctamente' });
  } catch (err) {
    console.error('❌ Error al actualizar dirección:', err);
    res.status(500).send('Error al actualizar dirección');
  } finally {
    if (conn) await conn.close();
  }
};

// ✅ Eliminar dirección
const eliminarDireccion = async (req, res) => {
  let conn;
  const clave = req.params.id;

  try {
    conn = await oracledb.getConnection();
    await conn.execute(
      `DELETE FROM DIRECCION_EMPLEADO WHERE CLAVE = :CLAVE`,
      { CLAVE: Number(clave) },
      { autoCommit: true }
    );

    res.json({ message: 'Dirección eliminada correctamente' });
  } catch (err) {
    if (err.errorNum === 2292) {
      res.status(409).send('No se puede eliminar esta dirección porque está siendo usada en otra tabla.');
    } else {
      console.error('❌ Error al eliminar dirección:', err);
      res.status(500).send('Error al eliminar dirección');
    }
  } finally {
    if (conn) await conn.close();
  }
};

module.exports = {
  obtenerDirecciones,
  crearDireccion,
  actualizarDireccion,
  eliminarDireccion
};
