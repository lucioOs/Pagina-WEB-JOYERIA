// src/components/DetallePedidoTable.jsx
import React from "react";

const DetallePedidoTable = () => {
  const detalles = [
    { clave: "DP001", pedido: "P001", joya: "J001", cantidad: 2 },
    { clave: "DP002", pedido: "P001", joya: "J005", cantidad: 1 },
    { clave: "DP003", pedido: "P002", joya: "J003", cantidad: 3 },
  ];

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Detalle de Pedidos</h2>

      <input
        type="text"
        placeholder="Buscar por pedido o joya..."
        className="form-control mb-3"
      />

      <table className="table table-bordered table-hover text-center">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Clave</th>
            <th>Pedido</th>
            <th>Joya</th>
            <th>Cantidad</th>
            <th>Editar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {detalles.map((d, index) => (
            <tr key={d.clave}>
              <td>{index + 1}</td>
              <td>{d.clave}</td>
              <td>{d.pedido}</td>
              <td>{d.joya}</td>
              <td>{d.cantidad}</td>
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

export default DetallePedidoTable;
