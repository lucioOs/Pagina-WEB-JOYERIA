import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaGem, FaUsers, FaUserTie, FaSignOutAlt, FaCartPlus, FaTruck, FaStore, FaCogs
} from 'react-icons/fa';
import { MdCategory } from 'react-icons/md';
import 'bootstrap/dist/css/bootstrap.min.css';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const secciones = [
    {
      titulo: 'Catálogo',
      items: [
        { path: '/joyas', label: 'Joyas', icon: <FaGem /> },
        { path: '/tipos', label: 'Tipos de Joya', icon: <MdCategory /> },
        { path: '/materiales', label: 'Materiales', icon: <FaGem /> },
        { path: '/diseniadores', label: 'Diseñadores', icon: <FaUserTie /> },
        { path: '/inventario', label: 'Inventario', icon: <FaCartPlus /> }
      ]
    },
    {
      titulo: 'Clientes',
      items: [
        { path: '/clientes', label: 'Clientes', icon: <FaUsers /> },
        { path: '/direccion_clientes', label: 'Dirección Clientes', icon: <FaUsers /> }
      ]
    },
    {
      titulo: 'Empleados',
      items: [
        { path: '/empleados', label: 'Empleados', icon: <FaUserTie /> },
        { path: '/direccion_empleados', label: 'Dirección Empleados', icon: <FaUserTie /> },
        { path: '/roles', label: 'Roles', icon: <FaCogs /> }
      ]
    },
    {
      titulo: 'Ventas',
      items: [
        { path: '/ventas', label: 'Ventas', icon: <FaCartPlus /> },
        { path: '/detalle_venta', label: 'Detalle Venta', icon: <FaCartPlus /> },
        { path: '/promociones', label: 'Promociones', icon: <FaGem /> },
        { path: '/metodos_pago', label: 'Métodos de Pago', icon: <FaCartPlus /> }
      ]
    },
    {
      titulo: 'Compras',
      items: [
        { path: '/compras', label: 'Compras', icon: <FaTruck /> },
        { path: '/detalle_compra', label: 'Detalle Compra', icon: <FaTruck /> },
        { path: '/distribuidores', label: 'Distribuidores', icon: <FaTruck /> }
      ]
    },
    {
      titulo: 'Sucursales',
      items: [
        { path: '/sucursales', label: 'Sucursales', icon: <FaStore /> },
        { path: '/direccion_sucursal', label: 'Dirección Sucursal', icon: <FaStore /> },
        { path: '/red_social', label: 'Red Social', icon: <FaStore /> }
      ]
    },
    {
      titulo: 'Pedidos',
      items: [
        { path: '/pedidos', label: 'Pedidos', icon: <FaTruck /> },
        { path: '/detalle_pedido', label: 'Detalle Pedido', icon: <FaTruck /> }
      ]
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('autenticado');
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
