import React, { useEffect, useState } from 'react';

const DetalleVentaTable = () => {
  const [detalles, setDetalles] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/detalleventa')
      .then(res => res.json())
      .then(setDetalles)
      .catch(err => console.error('Error al cargar detalles:', err));
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Detalle de Todas las Ventas</h2>

      <table className="table table-bordered text-center">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>CLAVE VENTA</th>
            <th>CLAVE JOYA</th>
            <th>JOYAS</th>
            <th>CANTIDAD</th>
          </tr>
        </thead>
        <tbody>
          {detalles.map((item, i) => (
            <tr key={`${item.CLAVE_VENTA}-${item.CLAVE_JOYA}`}>
              <td>{i + 1}</td>
              <td>{item.CLAVE_VENTA}</td>
              <td>{item.CLAVE_JOYA}</td>
              <td>{item.NOMBRE_JOYA || '—'}</td>
              <td>{item.CANTIDAD}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {detalles.length === 0 && (
        <p className="text-center text-muted">No hay registros en el detalle de ventas.</p>
      )}
    </div>
  );
};

export default DetalleVentaTable;
