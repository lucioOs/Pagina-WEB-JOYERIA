import React from "react";

const DetalleCompraTable = () => {
  const detalles = [
    {
      clave: "DC001",
      compra: "C001",
      joya: "J001 - Anillo Oro Blanco",
      cantidad: 5,
    },
    {
      clave: "DC002",
      compra: "C001",
      joya: "J002 - Pulsera Plata",
      cantidad: 3,
    },
    {
      clave: "DC003",
      compra: "C002",
      joya: "J003 - Gargantilla Esmeralda",
      cantidad: 2,
    },
  ];

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Detalle de Compras</h2>

      <input
        type="text"
        placeholder="Buscar por compra o joya..."
        className="form-control mb-3"
      />

      <table className="table table-bordered table-hover text-center">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Clave</th>
            <th>Compra</th>
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
              <td>{d.compra}</td>
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

export default DetalleCompraTable;
