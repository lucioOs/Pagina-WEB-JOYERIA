import React from "react";

const SucursalesTable = () => {
  const sucursales = [
    {
      clave: "S001",
      nombre: "Joyería Centro",
      telefono: "5551234567",
      correo: "centro@joyeria.com",
      ciudad: "CDMX",
      estado: "Ciudad de México",
    },
    {
      clave: "S002",
      nombre: "Joyería Sur",
      telefono: "5557654321",
      correo: "sur@joyeria.com",
      ciudad: "Toluca",
      estado: "Estado de México",
    },
  ];

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Catálogo de Sucursales</h2>

      <input
        type="text"
        placeholder="Buscar por nombre, ciudad o correo..."
        className="form-control mb-3"
      />

      <table className="table table-bordered table-hover text-center">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Clave</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th>Ciudad</th>
            <th>Estado</th>
            <th>Editar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {sucursales.map((sucursal, index) => (
            <tr key={sucursal.clave}>
              <td>{index + 1}</td>
              <td>{sucursal.clave}</td>
              <td>{sucursal.nombre}</td>
              <td>{sucursal.telefono}</td>
              <td>{sucursal.correo}</td>
              <td>{sucursal.ciudad}</td>
              <td>{sucursal.estado}</td>
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

export default SucursalesTable;
