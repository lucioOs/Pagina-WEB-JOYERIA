import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaGem, FaUsers, FaUserTie, FaShoppingCart, FaSignOutAlt
} from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const secciones = [
    {
      titulo: 'Catalogo',
      items: [
        { path: '/joyas', label: 'Joyas', icon: <FaGem /> },
        { path: '/tipos', label: 'Tipos de joya', icon: <FaGem /> },
        { path: '/materiales', label: 'Materiales', icon: <FaGem /> },
      ]
    },
    {
      titulo: 'Clientes',
      items: [
        { path: '/clientes', label: 'Clientes', icon: <FaUsers /> },
        { path: '/direccion_clientes', label: 'direccion_Clientes', icon: <FaUsers /> },
      ]
    },
    {
      titulo: 'Empleados',
      items: [
        { path: '/empleados', label: 'Empleados', icon: <FaUserTie /> },
      ]
    },
    {
      titulo: 'Ventas',
      items: [
        { path: '/ventas', label: 'Ventas', icon: <FaShoppingCart /> },
      ]
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('autenticado'); // clave correcta
    navigate('/');
  };

  return (
    <div className="d-flex min-vh-100">
      {/* Sidebar */}
      <div className="bg-dark text-white d-flex flex-column justify-content-between p-3" style={{ width: '250px' }}>
        <div>
          <h4 className="text-center mb-4">Joyería</h4>
          <ul className="nav flex-column">
            {secciones.map((seccion, i) => (
              <li key={i}>
                <h6 className="text-white mt-4 mb-2">{seccion.titulo}</h6>
                {seccion.items.map(item => (
                  <Link
                    key={item.path}
                    className={`nav-link text-white d-flex align-items-center mb-1 ps-3 ${location.pathname === item.path ? 'fw-bold bg-secondary rounded' : ''}`}
                    to={item.path}
                  >
                    <span className="me-2">{item.icon}</span> {item.label}
                  </Link>
                ))}
              </li>
            ))}
          </ul>
        </div>

        <button onClick={handleLogout} className="btn btn-outline-light w-100 mt-3 d-flex align-items-center justify-content-center">
          <FaSignOutAlt className="me-2" /> Cerrar sesión
        </button>
      </div>

      {/* Contenido principal */}
      <div className="flex-grow-1 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
