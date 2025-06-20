// src/components/MetodosPagoTable.jsx
import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';

const MetodosPagoTable = () => {
  const [metodos, setMetodos] = useState([]);
  const [form, setForm] = useState({ CLAVE: '', NOMBRE: '' });
  const [editando, setEditando] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const porPagina = 10;

  const fetchMetodos = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/metodospago');
      const data = await res.json();
      setMetodos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar métodos de pago:', err);
    }
  };

  useEffect(() => {
    fetchMetodos();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editando
      ? `http://localhost:3000/api/metodospago/${form.CLAVE}`
      : 'http://localhost:3000/api/metodospago';

    const method = editando ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error('Error al guardar');

      fetchMetodos();
      setForm({ CLAVE: '', NOMBRE: '' });
      setMostrarFormulario(false);
      setEditando(false);
    } catch (err) {
      alert('❌ ' + err.message);
    }
  };

  const handleEditar = (item) => {
    setForm(item);
    setEditando(true);
    setMostrarFormulario(true);
  };

  const handleEliminar = async (clave) => {
    if (!window.confirm('¿Eliminar este método de pago?')) return;

    try {
      const res = await fetch(`http://localhost:3000/api/metodospago/${clave}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Error al eliminar');
      fetchMetodos();
    } catch (err) {
      alert('❌ ' + err.message);
    }
  };

  const totalPaginas = Math.ceil(metodos.length / porPagina);
  const registrosPagina = metodos.slice((paginaActual - 1) * porPagina, paginaActual * porPagina);

  return (
    <div className="container position-relative">
      <h2 className="text-center my-4">Métodos de Pago</h2>

      <table className="table table-bordered text-center align-middle">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Clave</th>
            <th>Nombre</th>
            <th>Editar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {registrosPagina.map((item, i) => (
            <tr key={item.CLAVE}>
              <td>{(paginaActual - 1) * porPagina + i + 1}</td>
              <td>{item.CLAVE}</td>
              <td>{item.NOMBRE}</td>
              <td>
                <button className="btn btn-warning" onClick={() => handleEditar(item)}><FaEdit /></button>
              </td>
              <td>
                <button className="btn btn-danger" onClick={() => handleEliminar(item.CLAVE)}><FaTrash /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="pagination justify-content-center">
        <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => setPaginaActual(1)}>⏮</button>
        </li>
        <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => setPaginaActual(paginaActual - 1)}>◀</button>
        </li>
        {[...Array(totalPaginas)].map((_, i) => (
          <li key={i + 1} className={`page-item ${paginaActual === i + 1 ? 'active' : ''}`}>
            <button className="page-link" onClick={() => setPaginaActual(i + 1)}>{i + 1}</button>
          </li>
        ))}
        <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => setPaginaActual(paginaActual + 1)}>▶</button>
        </li>
        <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => setPaginaActual(totalPaginas)}>⏭</button>
        </li>
      </ul>

      <button
        className="btn btn-success rounded-circle position-fixed shadow"
        style={{ bottom: 40, right: 40 }}
        onClick={() => {
          setForm({ CLAVE: '', NOMBRE: '' });
          setEditando(false);
          setMostrarFormulario(true);
        }}
        title="Agregar método de pago"
      >
        <FaPlus />
      </button>

      {mostrarFormulario && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="d-flex justify-content-between mb-2">
              <h5>{editando ? 'Editar Método de Pago' : 'Agregar Método de Pago'}</h5>
              <button onClick={() => setMostrarFormulario(false)} className="btn"><FaTimes /></button>
            </div>
            <form className="row g-2" onSubmit={handleSubmit}>
              <div className="col-md-4">
                <input
                  name="CLAVE"
                  type="number"
                  className="form-control"
                  value={form.CLAVE}
                  onChange={handleChange}
                  placeholder="Clave"
                  required
                  disabled={editando}
                />
              </div>
              <div className="col-md-8">
                <input
                  name="NOMBRE"
                  type="text"
                  className="form-control"
                  value={form.NOMBRE}
                  onChange={handleChange}
                  placeholder="Nombre del método"
                  required
                />
              </div>
              <div className="col-12 d-grid mt-2">
                <button type="submit" className="btn btn-success">
                  {editando ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetodosPagoTable;
