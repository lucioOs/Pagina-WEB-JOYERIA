const oracledb = require('oracledb');

async function iniciarConexion() {
  try {
    await oracledb.createPool({
      user: 'JOYERIA_USER',
      password: '123456',
      connectString: 'localhost/XEPDB1'
    });
    console.log('✅ Conexión a Oracle exitosa');
  } catch (err) {
    console.error('❌ Error al conectar a Oracle:', err);
  }
}

module.exports = {
  oracledb,
  iniciarConexion,
  getConnection: () => oracledb.getConnection()
};
