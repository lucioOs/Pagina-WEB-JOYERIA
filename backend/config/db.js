const oracledb = require('oracledb');

async function iniciarConexion() {
  try {
    await oracledb.createPool({
      user: 'JOYERIA_USER',
      password: '123456',
      connectString: 'localhost/XEPDB1',
      poolMin: 2,
      poolMax: 10,
      poolTimeout: 60,
      queueTimeout: 120000
    });
    console.log('✅ Conexión a Oracle exitosa');
  } catch (error) {
    console.error('❌ Error al conectar a Oracle:', error);
  }
}

// ✅ ESTA FUNCIÓN FALTABA
async function getConnection() {
  return await oracledb.getConnection();
}

module.exports = {
  oracledb,
  iniciarConexion,
  getConnection  // ✅ Exportamos correctamente
};
