import React from "react";

const DistribuidoresTable = () => {
  const distribuidores = [
    {
      clave: "D001",
      nombre: "Distribuciones MX",
      correo: "contacto@distribucionesmx.com",
      telefono: "5551234567",
      ciudad: "CDMX",
    },
    {
      clave: "D002",
      nombre: "Ornamenta Proveedor",
      correo: "ventas@ornamenta.com",
      telefono: "5549876543",
      ciudad: "Guadalajara",
    },
    {
      clave: "D003",
      nombre: "Joyas del Norte",
      correo: "info@joyasnorte.com",
      telefono: "5588887777",
      ciudad: "Monterrey",
    },
  ];

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Catálogo de Distribuidores</h2>

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
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Ciudad</th>
            <th>Editar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {distribuidores.map((dist, index) => (
            <tr key={dist.clave}>
              <td>{index + 1}</td>
              <td>{dist.clave}</td>
              <td>{dist.nombre}</td>
              <td>{dist.correo}</td>
              <td>{dist.telefono}</td>
              <td>{dist.ciudad}</td>
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

export default DistribuidoresTable;
