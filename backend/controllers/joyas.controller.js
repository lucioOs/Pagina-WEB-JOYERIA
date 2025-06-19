const { oracledb } = require('../config/db');

// Obtener todas las joyas
const getJoyas = async (req, res) => {
  let conexion;
  try {
    conexion = await oracledb.getConnection();
    const result = await conexion.execute(
      `SELECT * FROM JOYA`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error al obtener joyas:", error);
    res.status(500).send('Error al obtener joyas');
  } finally {
    if (conexion) await conexion.close();
  }
};

// Obtener una joya por clave
const getJoyaPorClave = async (req, res) => {
  const { clave } = req.params;
  try {
    const conexion = await oracledb.getConnection();
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
  } catch (error) {
    console.error("❌ Error al obtener joya:", error);
    res.status(500).send('Error al obtener joya');
  }
};

// Crear una nueva joya
const crearJoya = async (req, res) => {
  const {
    nombre,
    descripcion,
    tipo,
    material,
    precio,
    inventario,
    foto,
    diseniador_clave
  } = req.body;

  try {
    const conexion = await oracledb.getConnection();
    await conexion.execute(
      `INSERT INTO JOYA (
         CLAVE, NOMBRE, DESCRIPCION, TIPO, MATERIAL, PRECIO, INVENTARIO, FOTO, DISENIADOR_CLAVE
       ) VALUES (
         joya_seq.NEXTVAL, :nombre, :descripcion, :tipo, :material, :precio, :inventario, :foto, :diseniador_clave
       )`,
      {
        nombre: nombre || null,
        descripcion: descripcion || null,
        tipo: tipo || null,
        material: material || null,
        precio: precio || null,
        inventario: inventario || null,
        foto: foto || null,
        diseniador_clave: diseniador_clave || null
      },
      { autoCommit: true }
    );
    res.status(201).send("Joya creada correctamente");
  } catch (error) {
    console.error("❌ Error al crear joya:", error);
    res.status(500).send("Error al crear joya");
  }
};

//Actualizar joya
const actualizarJoya = async (req, res) => {
  const { clave } = req.params;
  const {
    nombre,
    descripcion,
    tipo,
    material,
    precio,
    inventario,
    foto,
    diseniador_clave
  } = req.body;

  try {
    const conexion = await oracledb.getConnection();
    const result = await conexion.execute(
      `UPDATE JOYA SET
         NOMBRE = :nombre,
         DESCRIPCION = :descripcion,
         TIPO = :tipo,
         MATERIAL = :material,
         PRECIO = :precio,
         INVENTARIO = :inventario,
         FOTO = :foto,
         DISENIADOR_CLAVE = :diseniador_clave
       WHERE CLAVE = :clave`,
      {
        nombre: nombre || null,
        descripcion: descripcion || null,
        tipo: tipo || null,
        material: material || null,
        precio: precio || null,
        inventario: inventario || null,
        foto: foto || null,
        diseniador_clave: diseniador_clave || null,
        clave
      },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      res.status(404).send("❌ Joya no encontrada");
    } else {
      res.send("✅ Joya actualizada correctamente");
    }
  } catch (error) {
    console.error("❌ Error al actualizar joya:", error);
    res.status(500).send("Error al actualizar joya");
  }
};

// Eliminar joya
const eliminarJoya = async (req, res) => {
  const { clave } = req.params;
  try {
    const conexion = await oracledb.getConnection();
    const result = await conexion.execute(
      `DELETE FROM JOYA WHERE CLAVE = :clave`,
      [clave],
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      res.status(404).send("Joya no encontrada");
    } else {
      res.send("Joya eliminada correctamente");
    }
 } catch (error) {
  if (error.errorNum === 2292) {
    res.status(409).send("No se puede eliminar la joya: está relacionada con otros registros");
  } else {
    console.error("❌ Error al eliminar joya:", error);
    res.status(500).send("Error al eliminar joya");
  }
}
};

// Obtener tipos
const obtenerTipos = async (req, res) => {
  try {
    const conexion = await oracledb.getConnection();
    const result = await conexion.execute(
      `SELECT CLAVE, NOMBRE FROM TIPO_JOYA`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error al obtener tipos:", error);
    res.status(500).send("Error al obtener tipos");
  }
};

// Obtener materiales
const obtenerMateriales = async (req, res) => {
  try {
    const conexion = await oracledb.getConnection();
    const result = await conexion.execute(
      `SELECT CLAVE, NOMBRE FROM MATERIAL`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error al obtener materiales:", error);
    res.status(500).send("Error al obtener materiales");
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
