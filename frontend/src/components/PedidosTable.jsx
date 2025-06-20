import React from "react";

const PedidosTable = () => {
  const pedidos = [
    {
      clave: "P001",
      fecha: "2024-06-15",
      cliente: "Carlos Pérez",
      sucursal: "Joyería Centro",
      envio: "Envío Express",
      distribuidor: "DHL",
      estado: "En proceso",
    },
    {
      clave: "P002",
      fecha: "2024-06-18",
      cliente: "Ana García",
      sucursal: "Joyería Gran Sur",
      envio: "Retiro en sucursal",
      distribuidor: "Interno",
      estado: "Entregado",
    },
  ];

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Catálogo de Pedidos</h2>

      <input
        type="text"
        placeholder="Buscar por cliente, sucursal o estado..."
        className="form-control mb-3"
      />

      <table className="table table-bordered table-hover text-center">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Clave</th>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Sucursal</th>
            <th>Tipo de Envío</th>
            <th>Distribuidor</th>
            <th>Estado</th>
            <th>Editar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((p, index) => (
            <tr key={p.clave}>
              <td>{index + 1}</td>
              <td>{p.clave}</td>
              <td>{p.fecha}</td>
              <td>{p.cliente}</td>
              <td>{p.sucursal}</td>
              <td>{p.envio}</td>
              <td>{p.distribuidor}</td>
              <td>{p.estado}</td>
              <td>
                <button className="btn btn-warning btn-sm">
                  <i className="fas fa-edit"></i>
                </button>
              </td>
              <td>
                <button className="btn btn-danger btn-sm">
                  <i className="fas fa-trash-alt"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-center">
        <nav>
          <ul className="pagination">
            <li className="page-item disabled">
              <button className="page-link">«</button>
            </li>
            <li className="page-item active">
              <button className="page-link">1</button>
            </li>
            <li className="page-item">
              <button className="page-link">2</button>
            </li>
            <li className="page-item">
              <button className="page-link">»</button>
            </li>
          </ul>
        </nav>
      </div>

      <button
        className="btn btn-success rounded-circle"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "50px",
          height: "50px",
        }}
      >
        <i className="fas fa-plus"></i>
      </button>
    </div>
  );
};

export default PedidosTable;
