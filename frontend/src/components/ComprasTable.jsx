import React from "react";

const ComprasTable = () => {
  const compras = [
    {
      clave: "C001",
      fecha: "2024-06-10",
      empleado: "Pedro García",
      sucursal: "Joyería Centro",
      distribuidor: "Distribuciones MX",
      total: "$12,500",
    },
    {
      clave: "C002",
      fecha: "2024-06-18",
      empleado: "Ana Gómez",
      sucursal: "Joyería Toluca",
      distribuidor: "Ornamenta Proveedor",
      total: "$8,200",
    },
  ];

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Catálogo de Compras</h2>

      <input
        type="text"
        placeholder="Buscar por distribuidor o sucursal..."
        className="form-control mb-3"
      />

      <table className="table table-bordered table-hover text-center">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Clave</th>
            <th>Fecha</th>
            <th>Empleado</th>
            <th>Sucursal</th>
            <th>Distribuidor</th>
            <th>Total</th>
            <th>Editar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {compras.map((compra, index) => (
            <tr key={compra.clave}>
              <td>{index + 1}</td>
              <td>{compra.clave}</td>
              <td>{compra.fecha}</td>
              <td>{compra.empleado}</td>
              <td>{compra.sucursal}</td>
              <td>{compra.distribuidor}</td>
              <td>{compra.total}</td>
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

export default ComprasTable;
