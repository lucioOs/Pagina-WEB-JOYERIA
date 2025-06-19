// src/components/Home.jsx
import React from 'react';
import { FaGem, FaUsers, FaShoppingCart } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="container py-5 text-center">
      <h1 className="mb-4 display-5 fw-bold">💍 Bienvenido a Joyería Luxor</h1>
      <p className="text-muted fs-5 mb-5">
        Administra tu <strong>inventario</strong>, <strong>clientes</strong> y <strong>ventas</strong> desde un solo lugar.
      </p>

      <div className="row justify-content-center mb-5">
        <div className="col-md-3 mx-3 mb-4">
          <div className="card shadow h-100">
            <div className="card-body">
              <FaGem size={40} className="text-primary mb-2" />
              <h5 className="card-title">Inventario</h5>
              <p className="card-text">Agrega, edita y consulta todas las joyas disponibles en el sistema.</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mx-3 mb-4">
          <div className="card shadow h-100">
            <div className="card-body">
              <FaUsers size={40} className="text-success mb-2" />
              <h5 className="card-title">Clientes</h5>
              <p className="card-text">Consulta el historial de compras y gestiona tus clientes frecuentes.</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mx-3 mb-4">
          <div className="card shadow h-100">
            <div className="card-body">
              <FaShoppingCart size={40} className="text-danger mb-2" />
              <h5 className="card-title">Ventas</h5>
              <p className="card-text">Visualiza tus ventas, fechas, totales y administra cada transacción.</p>
            </div>
          </div>
        </div>
      </div>

      <img
        src="/src/assets/jewelry-display.png"
        alt="Joyería elegante"
        className="img-fluid rounded shadow"
        style={{ maxWidth: '500px' }}
      />

      <div className="mt-4">
        <a href="/joyas" className="btn btn-primary btn-lg shadow">Ir al Inventario</a>
      </div>
    </div>
  );
};

export default Home;
