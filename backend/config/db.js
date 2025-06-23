const oracledb = require('oracledb');

// Configuración del pool
const dbConfig = {
  user: 'JOYERIA_USER',
  password: '123456',
  connectString: 'localhost/XEPDB1',
  poolMin: 2,
  poolMax: 10,
  poolTimeout: 60,
  queueTimeout: 300000  // Aumentamos a 5 minutos
};

let pool;

async function iniciarConexion() {
  try {
    if (!pool) {
      pool = await oracledb.createPool(dbConfig);
      console.log('✅ Conexión a Oracle exitosa');
    } else {
      console.log('⚠️ El pool ya estaba iniciado');
    }
  } catch (error) {
    console.error('❌ Error al conectar a Oracle:', error);
  }
}

async function getConnection() {
  try {
    if (!pool) {
      await iniciarConexion();  // Asegura que el pool esté inicializado
    }
    return await pool.getConnection();
  } catch (err) {
    console.error('❌ Error al obtener conexión:', err);
    throw err;
  }
}

module.exports = {
  oracledb,
  iniciarConexion,
  getConnection
};
