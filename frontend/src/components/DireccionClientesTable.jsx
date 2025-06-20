import React from "react";

const DireccionClientesTable = () => {
  const direcciones = [
    {
      clave: "DC001",
      cliente: "Carlos Pérez",
      calle: "Av. Reforma",
      numero: "123",
      colonia: "Centro",
      cp: "06000",
      ciudad: "CDMX",
      estado: "Ciudad de México",
    },
    {
      clave: "DC002",
      cliente: "Ana García",
      calle: "Calle 5",
      numero: "456-B",
      colonia: "Lomas",
      cp: "45000",
      ciudad: "Zapopan",
      estado: "Jalisco",
    },
  ];

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Dirección de Clientes</h2>

      <input
        type="text"
        placeholder="Buscar por cliente o ciudad..."
        className="form-control mb-3"
      />

      <table className="table table-bordered table-hover text-center">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Clave</th>
            <th>Cliente</th>
            <th>Calle</th>
            <th>Número</th>
            <th>Colonia</th>
            <th>CP</th>
            <th>Ciudad</th>
            <th>Estado</th>
            <th>Editar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {direcciones.map((dir, index) => (
            <tr key={dir.clave}>
              <td>{index + 1}</td>
              <td>{dir.clave}</td>
              <td>{dir.cliente}</td>
              <td>{dir.calle}</td>
              <td>{dir.numero}</td>
              <td>{dir.colonia}</td>
              <td>{dir.cp}</td>
              <td>{dir.ciudad}</td>
              <td>{dir.estado}</td>
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

export default DireccionClientesTable;
