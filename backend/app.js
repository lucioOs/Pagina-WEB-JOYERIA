const express = require('express');
const cors = require('cors');
const { iniciarConexion } = require('./config/db');
const joyasRoutes = require('./routes/joyas.routes');
const clientesRoutes = require('./routes/clientes.routes'); 
const empleadosRoutes = require('./routes/empleados.routes');
const rolesRoutes = require('./routes/roles.routes');
const ventasRoutes = require('./routes/ventas.routes');
const sucursalesRoutes = require('./routes/sucursales.routes');
const tipoJoyaRoutes = require('./routes/tipoJoya.routes');
const app = express();
const puerto = process.env.PUERTO || 3000;

app.use(cors()); // ✅ importante
app.use(express.json());

// Rutas
app.use('/api/joyas', joyasRoutes);
app.use('/api/clientes', clientesRoutes); 
app.use('/api/empleados', empleadosRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api/sucursales', sucursalesRoutes);
app.use('/api/tipojoya', tipoJoyaRoutes);


app.get('/', (req, res) => {
  res.send('API REST Joyería funcionando');


});

iniciarConexion();
app.listen(puerto, () => {
  console.log(`Servidor backend corriendo en puerto ${puerto}`);
});
