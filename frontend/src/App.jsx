import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import JoyasTable from './components/JoyasTable';
import ClientesTable from './components/ClientesTable';
import EmpleadosTable from './components/EmpleadosTable';
import VentasTable from './components/VentasTable';
import Login from './components/Login';


const Protegido = ({ children }) => {
  const autenticado = localStorage.getItem('autenticado') === 'true';
  return autenticado ? children : <Navigate to="/" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/" element={<Protegido><Layout /></Protegido>}>
          <Route path="joyas" element={<JoyasTable />} />
          <Route path="clientes" element={<ClientesTable />} />
          <Route path="/empleados" element={<EmpleadosTable />} />
          <Route path="/ventas" element={<VentasTable />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
