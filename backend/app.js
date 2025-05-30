const express = require('express');
const cors = require('cors'); // ✅ nuevo
const { iniciarConexion } = require('./config/db');
const joyasRoutes = require('./routes/joyas.routes');

const app = express();
const puerto = process.env.PUERTO || 3000;

app.use(cors()); // ✅ importante
app.use(express.json());

// Rutas
app.use('/api/joyas', joyasRoutes);

app.get('/', (req, res) => {
  res.send('API REST Joyería funcionando');
});

iniciarConexion();
app.listen(puerto, () => {
  console.log(`Servidor backend corriendo en puerto ${puerto}`);
});
