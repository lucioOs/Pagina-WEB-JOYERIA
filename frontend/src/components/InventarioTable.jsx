import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';

const InventarioTable = () => {
  const [inventario, setInventario] = useState([]);
  const [form, setForm] = useState({ CLAVE_JOYA: '', CLAVE_SUCURSAL: '', CANTIDAD: '' });
  const [editando, setEditando] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [joyas, setJoyas] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const porPagina = 10;

  useEffect(() => {
    fetchInventario();
    fetch('http://localhost:3000/api/joyas').then(res => res.json()).then(setJoyas);
    fetch('http://localhost:3000/api/sucursales').then(res => res.json()).then(setSucursales);
  }, []);

  const fetchInventario = async () => {
    const res = await fetch('http://localhost:3000/api/inventario');
    const data = await res.json();
    setInventario(Array.isArray(data) ? data : []);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const url = editando
    ? `http://localhost:3000/api/inventario/${form.CLAVE_JOYA}/${form.CLAVE_SUCURSAL}`
    : `http://localhost:3000/api/inventario`;

  const method = editando ? 'PUT' : 'POST';
  const payload = editando
    ? { CANTIDAD: Number(form.CANTIDAD) }
    : {
        CLAVE_JOYA: form.CLAVE_JOYA,
        CLAVE_SUCURSAL: form.CLAVE_SUCURSAL,
        CANTIDAD: Number(form.CANTIDAD),
      };

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error('Error al guardar');
    fetchInventario();
    setForm({ CLAVE_JOYA: '', CLAVE_SUCURSAL: '', CANTIDAD: '' });
    setMostrarFormulario(false);
    setEditando(false);
  } catch (err) {
    alert(`❌ ${err.message}`);
  }
};

  const handleEditar = (item) => {
    setForm(item);
    setEditando(true);
    setMostrarFormulario(true);
  };

  const handleEliminar = async (claveJoya, claveSucursal) => {
    if (!window.confirm('¿Eliminar este registro?')) return;
    try {
      const res = await fetch(`http://localhost:3000/api/inventario/${claveJoya}/${claveSucursal}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Error al eliminar');
      fetchInventario();
    } catch (err) {
      alert(`❌ ${err.message}`);
    }
  };

  const getNombreJoya = (clave) => joyas.find(j => j.CLAVE === clave)?.NOMBRE || clave;
  const getNombreSucursal = (clave) => sucursales.find(s => s.CLAVE === clave)?.NOMBRE || clave;

  const totalPaginas = Math.ceil(inventario.length / porPagina);
  const registrosPagina = inventario.slice((paginaActual - 1) * porPagina, paginaActual * porPagina);

  return (
    <div className="container position-relative">
      <h2 className="text-center my-4">Inventario</h2>

      <table className="table table-bordered text-center align-middle">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Joya</th>
            <th>Sucursal</th>
            <th>Cantidad</th>
            <th>Editar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {registrosPagina.map((item, i) => (
            <tr key={`${item.CLAVE_JOYA}-${item.CLAVE_SUCURSAL}`}>
              <td>{(paginaActual - 1) * porPagina + i + 1}</td>
              <td>{getNombreJoya(item.CLAVE_JOYA)}</td>
              <td>{getNombreSucursal(item.CLAVE_SUCURSAL)}</td>
              <td>{item.CANTIDAD}</td>
              <td><button className="btn btn-warning" onClick={() => handleEditar(item)}><FaEdit /></button></td>
              <td><button className="btn btn-danger" onClick={() => handleEliminar(item.CLAVE_JOYA, item.CLAVE_SUCURSAL)}><FaTrash /></button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="pagination justify-content-center">
        <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}><button className="page-link" onClick={() => setPaginaActual(1)}>⏮</button></li>
        <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}><button className="page-link" onClick={() => setPaginaActual(paginaActual - 1)}>◀</button></li>
        {[...Array(totalPaginas)].map((_, i) => (
          <li key={i + 1} className={`page-item ${paginaActual === i + 1 ? 'active' : ''}`}><button className="page-link" onClick={() => setPaginaActual(i + 1)}>{i + 1}</button></li>
        ))}
        <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}><button className="page-link" onClick={() => setPaginaActual(paginaActual + 1)}>▶</button></li>
        <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}><button className="page-link" onClick={() => setPaginaActual(totalPaginas)}>⏭</button></li>
      </ul>

      <button
        className="btn btn-success rounded-circle position-fixed shadow"
        style={{ bottom: 40, right: 40 }}
        onClick={() => {
          setForm({ CLAVE_JOYA: '', CLAVE_SUCURSAL: '', CANTIDAD: '' });
          setEditando(false);
          setMostrarFormulario(true);
        }}
        title="Agregar inventario"
      >
        <FaPlus />
      </button>

      {mostrarFormulario && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="d-flex justify-content-between mb-2">
              <h5>{editando ? 'Editar Inventario' : 'Agregar Inventario'}</h5>
              <button onClick={() => setMostrarFormulario(false)} className="btn"><FaTimes /></button>
            </div>
            <form className="row g-2" onSubmit={handleSubmit}>
              <div className="col-md-5">
  <select
    name="CLAVE_JOYA"
    className="form-select"
    value={form.CLAVE_JOYA}
    onChange={handleChange}
    required
    disabled={editando} // ⛔️ bloquea el campo si se está editando
  >
    <option value="">Selecciona Joya</option>
    {joyas.map(j => (
      <option key={j.CLAVE} value={j.CLAVE}>
        {j.NOMBRE}
      </option>
    ))}
  </select>
</div>

<div className="col-md-5">
  <select
    name="CLAVE_SUCURSAL"
    className="form-select"
    value={form.CLAVE_SUCURSAL}
    onChange={handleChange}
    required
    disabled={editando} // ⛔️ bloquea el campo si se está editando
  >
    <option value="">Selecciona Sucursal</option>
    {sucursales.map(s => (
      <option key={s.CLAVE} value={s.CLAVE}>
        {s.NOMBRE}
      </option>
    ))}
  </select>
</div>

              <div className="col-md-2">
                <input name="CANTIDAD" type="number" className="form-control" value={form.CANTIDAD} onChange={handleChange} placeholder="Cantidad" required />
              </div>
              <div className="col-12 d-grid mt-2">
                <button type="submit" className="btn btn-success">{editando ? 'Actualizar' : 'Guardar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventarioTable;
