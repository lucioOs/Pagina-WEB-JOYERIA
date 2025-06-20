import React from "react";

const PromocionesTable = () => {
  const promociones = [
    {
      clave: "PR001",
      nombre: "Verano Dorado",
      descripcion: "10% en joyas de oro",
      descuento: "10%",
      inicio: "2024-06-01",
      fin: "2024-07-15",
    },
    {
      clave: "PR002",
      nombre: "Aniversario",
      descripcion: "20% en artículos seleccionados",
      descuento: "20%",
      inicio: "2024-07-01",
      fin: "2024-07-10",
    },
    // puedes agregar más registros estáticos
  ];

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Catálogo de Promociones</h2>

      <input
        type="text"
        placeholder="Buscar por nombre o descripción..."
        className="form-control mb-3"
      />

      <table className="table table-bordered table-hover text-center">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Clave</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Descuento</th>
            <th>Inicio</th>
            <th>Fin</th>
            <th>Editar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {promociones.map((promo, index) => (
            <tr key={promo.clave}>
              <td>{index + 1}</td>
              <td>{promo.clave}</td>
              <td>{promo.nombre}</td>
              <td>{promo.descripcion}</td>
              <td>{promo.descuento}</td>
              <td>{promo.inicio}</td>
              <td>{promo.fin}</td>
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

export default PromocionesTable;
