import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
import { BASE_URL } from '../config';
import axios from 'axios'; // Agrega esto


const RolesTable = () => {
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({});
  const [editando, setEditando] = useState(false);
  const [claveEditando, setClaveEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const porPagina = 10;

  const URL = `${BASE_URL}/roles`;

  useEffect(() => {
    obtenerRoles();
  }, []);

  const obtenerRoles = async () => {
    const res = await fetch(URL);
    const data = await res.json();
    setRoles(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      NOMBRE: form.NOMBRE
    };

    const metodo = editando ? 'PUT' : 'POST';
    const endpoint = editando ? `${URL}/${claveEditando}` : URL;

    const res = await fetch(endpoint, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      obtenerRoles();
      setForm({});
      setEditando(false);
      setMostrarFormulario(false);
    } else {
      const msg = await res.text();
      alert('❌ Error: ' + msg);
    }
  };

  const handleEditar = (rol) => {
    setForm({ NOMBRE: rol.NOMBRE });
    setClaveEditando(rol.CLAVE);
    setEditando(true);
    setMostrarFormulario(true);
  };

 const handleEliminar = async (clave) => {
  if (!window.confirm("¿Estás seguro de eliminar este rol?")) return;

  try {
    const res = await axios.delete(`${BASE_URL}/roles/${clave}`);
    alert(res.data.mensaje);
    obtenerRoles(); // o cargarRoles(), según el nombre que usas
  } catch (error) {
    const mensaje = error.response?.data?.error || '❌ Error desconocido al eliminar el rol.';
    alert(mensaje);
  }
};


  const filtrados = roles.filter(r =>
    (r.NOMBRE || '').toLowerCase().includes(busqueda.toLowerCase())
  );

  const totalPaginas = Math.ceil(filtrados.length / porPagina);
  const pagina = filtrados.slice((paginaActual - 1) * porPagina, paginaActual * porPagina);

  return (
    <div className="container position-relative">
      <h2 className="text-center my-4">Catálogo de Roles</h2>

      <input
        type="text"
        placeholder="Buscar por nombre..."
        className="form-control mb-3"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <table className="table table-bordered text-center align-middle">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Editar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {pagina.map((r, i) => (
            <tr key={r.CLAVE}>
              <td>{(paginaActual - 1) * porPagina + i + 1}</td>
              <td>{r.NOMBRE}</td>
              <td>
                <button className="btn btn-warning" onClick={() => handleEditar(r)}>
                  <FaEdit />
                </button>
              </td>
              <td>
                <button className="btn btn-danger" onClick={() => handleEliminar(r.CLAVE)}>
                  <FaTrash />
                </button>
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
          setForm({});
          setEditando(false);
          setMostrarFormulario(true);
        }}
      >
        <FaPlus />
      </button>

      {mostrarFormulario && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="d-flex justify-content-between mb-2">
              <h5>{editando ? 'Editar rol' : 'Agregar nuevo rol'}</h5>
              <button onClick={() => setMostrarFormulario(false)} className="btn"><FaTimes /></button>
            </div>
            <form onSubmit={handleSubmit} className="row g-2">
              <div className="col-12">
                <input
                  name="NOMBRE"
                  placeholder="Nombre del rol"
                  value={form.NOMBRE || ''}
                  onChange={handleChange}
                  className="form-control"
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

export default RolesTable;
