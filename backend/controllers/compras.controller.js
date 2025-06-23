const { getConnection } = require('../config/db');

// ✅ Obtener todas las compras
const getCompras = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      `SELECT 
        c.CLAVE,
        TO_CHAR(c.FECHA, 'YYYY-MM-DD') AS FECHA,
        e.NOMBRE || ' ' || e.APELLIDO_PAT AS EMPLEADO,
        s.NOMBRE AS SUCURSAL,
        d.NOMBRE AS DISTRIBUIDOR,
        c.TOTAL
      FROM COMPRA c
      JOIN EMPLEADO e ON c.CLAVE_EMPLEADO = e.CLAVE
      JOIN SUCURSAL s ON c.CLAVE_SUCURSAL = s.CLAVE
      JOIN DISTRIBUIDOR d ON c.CLAVE_DISTRIBUIDOR = d.CLAVE`,
      [],
      { outFormat: connection.OUT_FORMAT_OBJECT }
    );

    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error al obtener compras:', error);
    res.status(500).json({ error: 'Error al obtener compras' });
  } finally {
    if (connection) await connection.close();
  }
};

// ✅ Agregar nueva compra
const createCompra = async (req, res) => {
  const { CLAVE, FECHA, CLAVE_EMPLEADO, CLAVE_SUCURSAL, CLAVE_DISTRIBUIDOR, TOTAL } = req.body;

  let connection;
  try {
    connection = await getConnection();

    await connection.execute(
      `INSERT INTO COMPRA (CLAVE, FECHA, CLAVE_EMPLEADO, CLAVE_SUCURSAL, CLAVE_DISTRIBUIDOR, TOTAL)
       VALUES (:CLAVE, TO_DATE(:FECHA, 'YYYY-MM-DD'), :CLAVE_EMPLEADO, :CLAVE_SUCURSAL, :CLAVE_DISTRIBUIDOR, :TOTAL)`,
      [CLAVE, FECHA, CLAVE_EMPLEADO, CLAVE_SUCURSAL, CLAVE_DISTRIBUIDOR, TOTAL],
      { autoCommit: true }
    );

    res.status(201).json({ mensaje: 'Compra agregada correctamente' });
  } catch (error) {
    console.error('❌ Error al agregar compra:', error);
    res.status(500).json({ error: 'Error al agregar compra' });
  } finally {
    if (connection) await connection.close();
  }
};

// ✅ Actualizar compra
const updateCompra = async (req, res) => {
  const { clave } = req.params;
  const { FECHA, CLAVE_EMPLEADO, CLAVE_SUCURSAL, CLAVE_DISTRIBUIDOR, TOTAL } = req.body;

  let connection;
  try {
    connection = await getConnection();

    await connection.execute(
      `UPDATE COMPRA
       SET FECHA = TO_DATE(:FECHA, 'YYYY-MM-DD'),
           CLAVE_EMPLEADO = :CLAVE_EMPLEADO,
           CLAVE_SUCURSAL = :CLAVE_SUCURSAL,
           CLAVE_DISTRIBUIDOR = :CLAVE_DISTRIBUIDOR,
           TOTAL = :TOTAL
       WHERE CLAVE = :CLAVE`,
      [FECHA, CLAVE_EMPLEADO, CLAVE_SUCURSAL, CLAVE_DISTRIBUIDOR, TOTAL, clave],
      { autoCommit: true }
    );

    res.json({ mensaje: 'Compra actualizada correctamente' });
  } catch (error) {
    console.error('❌ Error al actualizar compra:', error);
    res.status(500).json({ error: 'Error al actualizar compra' });
  } finally {
    if (connection) await connection.close();
  }
};

// ✅ Eliminar compra
const deleteCompra = async (req, res) => {
  const { clave } = req.params;

  let connection;
  try {
    connection = await getConnection();

    await connection.execute(
      `DELETE FROM COMPRA WHERE CLAVE = :CLAVE`,
      [clave],
      { autoCommit: true }
    );

    res.json({ mensaje: 'Compra eliminada correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar compra:', error);
    res.status(500).json({ error: 'Error al eliminar compra' });
  } finally {
    if (connection) await connection.close();
  }
};

module.exports = {
  getCompras,
  createCompra,
  updateCompra,
  deleteCompra,
};
