import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './components/Login';
import 'bootstrap/dist/css/bootstrap.min.css';


// Tablas
import JoyasTable from './components/JoyasTable';
import TiposJoyaTable from './components/TiposJoyaTable';
import MaterialesTable from './components/MaterialesTable';
import DiseniadoresTable from './components/DiseniadoresTable';
import InventarioTable from './components/InventarioTable';

import ClientesTable from './components/ClientesTable';
import DireccionClientesTable from './components/DireccionClientesTable';

import EmpleadosTable from './components/EmpleadosTable';
import DireccionEmpleadosTable from './components/DireccionEmpleadosTable';
import RolesTable from './components/RolesTable';

import VentasTable from './components/VentasTable';
import DetalleVentaTable from './components/DetalleVentaTable';
import PromocionesTable from './components/PromocionesTable';
import MetodosPagoTable from './components/MetodosPagoTable';

import PedidosTable from './components/PedidosTable';
import DetallePedidoTable from './components/DetallePedidoTable';

import ComprasTable from './components/ComprasTable';
import DetalleCompraTable from './components/DetalleCompraTable';
import DistribuidoresTable from './components/DistribuidoresTable';

import SucursalesTable from './components/SucursalesTable';
import DireccionSucursalTable from './components/DireccionSucursalTable';
import RedSocialTable from './components/RedSocialTable';

// Rutas protegidas
const Protegido = ({ children }) => {
  const autenticado = localStorage.getItem('autenticado') === 'true';
  return autenticado ? children : <Navigate to="/" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Rutas protegidas */}
        <Route element={<Protegido><Layout /></Protegido>}>
          {/* Catálogo */}
          <Route path="/joyas" element={<JoyasTable />} />
          <Route path="/tipos" element={<TiposJoyaTable />} />
          <Route path="/materiales" element={<MaterialesTable />} />
          <Route path="/diseniadores" element={<DiseniadoresTable />} />
          <Route path="/inventario" element={<InventarioTable />} />

          {/* Clientes */}
          <Route path="/clientes" element={<ClientesTable />} />
          <Route path="/direccion_clientes" element={<DireccionClientesTable />} />

          {/* Empleados */}
          <Route path="/empleados" element={<EmpleadosTable />} />
          <Route path="/direccion_empleados" element={<DireccionEmpleadosTable />} />
          <Route path="/roles" element={<RolesTable />} />

          {/* Ventas */}
          <Route path="/ventas" element={<VentasTable />} />
          <Route path="/detalle_venta" element={<DetalleVentaTable />} />
          <Route path="/promociones" element={<PromocionesTable />} />
          <Route path="/metodos_pago" element={<MetodosPagoTable />} />

          {/* Pedidos */}
          <Route path="/pedidos" element={<PedidosTable />} />
          <Route path="/detalle_pedido" element={<DetallePedidoTable />} />

          {/* Compras */}
          <Route path="/compras" element={<ComprasTable />} />
          <Route path="/detalle_compra" element={<DetalleCompraTable />} />
          <Route path="/distribuidores" element={<DistribuidoresTable />} />

          {/* Sucursales */}
          <Route path="/sucursales" element={<SucursalesTable />} />
          <Route path="/direccion_sucursal" element={<DireccionSucursalTable />} />
          <Route path="/red_social" element={<RedSocialTable />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
