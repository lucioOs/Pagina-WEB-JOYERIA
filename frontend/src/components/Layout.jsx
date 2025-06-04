// src/components/Layout.jsx
import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { FaGem, FaUsers, FaShoppingCart, FaSignOutAlt } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/joyas', label: 'Joyas', icon: <FaGem /> },
    { path: '/clientes', label: 'Clientes', icon: <FaUsers /> },
    { path: '/ventas', label: 'Ventas', icon: <FaShoppingCart /> }
  ];

  const handleLogout = () => {
    localStorage.removeItem('usuario'); // o la clave que uses para almacenar el login
    navigate('/');
  };

  return (
    <div className="d-flex min-vh-100">
      {/* Sidebar */}
      <div className="bg-dark text-white d-flex flex-column justify-content-between p-3" style={{ width: '250px' }}>
        <div>
          <h4 className="text-center mb-4">Joyería </h4>
          <ul className="nav flex-column">
            {navItems.map(item => (
              <li className="nav-item" key={item.path}>
                <Link
                  className={`nav-link text-white d-flex align-items-center mb-2 ${location.pathname === item.path ? 'active fw-bold bg-secondary rounded' : ''}`}
                  to={item.path}
                >
                  <span className="me-2">{item.icon}</span> {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <button onClick={handleLogout} className="btn btn-outline-light w-100 mt-3 d-flex align-items-center justify-content-center">
          <FaSignOutAlt className="me-2" /> Cerrar sesión
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
