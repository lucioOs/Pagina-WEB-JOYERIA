import React from "react";

const DiseniadoresTable = () => {
  const diseniadores = [
    { clave: "DIS001", nombre: "Ana Ruiz", especialidad: "Minimalista" },
    { clave: "DIS002", nombre: "Carlos Mendoza", especialidad: "Clásico" },
    { clave: "DIS003", nombre: "Lucía Ortega", especialidad: "Moderno" },
    { clave: "DIS004", nombre: "Roberto Salas", especialidad: "Vintage" },
  ];

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Diseñadores</h2>

      <input
        type="text"
        placeholder="Buscar por nombre o especialidad..."
        className="form-control mb-3"
      />

      <table className="table table-bordered table-hover text-center">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Clave</th>
            <th>Nombre</th>
            <th>Especialidad</th>
            <th>Editar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {diseniadores.map((dis, index) => (
            <tr key={dis.clave}>
              <td>{index + 1}</td>
              <td>{dis.clave}</td>
              <td>{dis.nombre}</td>
              <td>{dis.especialidad}</td>
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

export default DiseniadoresTable;
