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
const diseniadoresRoutes = require('./routes/diseniadores.routes');
const inventarioRoutes = require('./routes/inventario.routes');
const metodosPagoRoutes = require('./routes/metodosPago.routes');
const promocionesRoutes = require('./routes/promociones.routes');
const detalleVentaRoutes = require('./routes/detalleVenta.routes');
const materialesRoutes = require('./routes/materiales.routes');
const direccionClientesRoutes = require('./routes/direccionclientes.routes');
const estadosRoutes = require('./routes/estados.routes');


const genericRoutes = require('./routes/generic.routes'); // ✅ Rutas CRUD automáticas

const app = express();
const puerto = process.env.PUERTO || 3000;

app.use(cors());
app.use(express.json());

// Rutas manuales
app.use('/api/joyas', joyasRoutes);
app.use('/api/clientes', clientesRoutes); 
app.use('/api/empleados', empleadosRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api/sucursales', sucursalesRoutes);
app.use('/api/tipojoya', tipoJoyaRoutes);
app.use('/api/diseniadores', diseniadoresRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/metodospago', metodosPagoRoutes);
app.use('/api/promociones', promocionesRoutes);
app.use('/api/detalleventa', detalleVentaRoutes);
app.use('/api/materiales', materialesRoutes);
app.use('/api/direccionclientes', direccionClientesRoutes);
app.use('/api/estados', estadosRoutes);

// Rutas genéricas (¡puedes usar /api/material, /api/inventario, etc!)
app.use('/api', genericRoutes);


app.get('/', (req, res) => {
  res.send('API REST Joyería funcionando');
});

iniciarConexion();
app.listen(puerto, () => {
  console.log(`Servidor backend corriendo en puerto ${puerto}`);
});
