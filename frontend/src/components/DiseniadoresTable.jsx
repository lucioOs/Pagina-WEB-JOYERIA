import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { BASE_URL } from '../config'; // ✅ Importamos BASE_URL

const DiseniadoresTable = () => {
  const [diseniadores, setDiseniadores] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [nombre, setNombre] = useState('');
  const [apPat, setApPat] = useState('');
  const [editando, setEditando] = useState(null);

  const itemsPorPagina = 10;
  const [paginaActual, setPaginaActual] = useState(1);

  const obtenerDiseniadores = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/diseniadores`);
      setDiseniadores(res.data);
    } catch (err) {
      console.error('Error al obtener diseñadores:', err);
    }
  };

  useEffect(() => {
    obtenerDiseniadores();
  }, []);

  const handleAgregar = async () => {
    if (!nombre.trim()) return alert('El nombre es obligatorio');
    try {
      await axios.post(`${BASE_URL}/diseniadores`, {
        NOMBRE: nombre.trim(),
        AP_PAT: apPat.trim()
      });
      setNombre('');
      setApPat('');
      obtenerDiseniadores();
    } catch (err) {
      console.error('Error al agregar diseñador:', err);
    }
  };

  const handleEditar = (diseniador) => {
    setEditando(diseniador.CLAVE);
    setNombre(diseniador.NOMBRE);
    setApPat(diseniador.AP_PAT);
  };

  const handleActualizar = async () => {
    try {
      await axios.put(`${BASE_URL}/diseniadores/${editando}`, {
        NOMBRE: nombre.trim(),
        AP_PAT: apPat.trim()
      });
      setEditando(null);
      setNombre('');
      setApPat('');
      obtenerDiseniadores();
    } catch (err) {
      console.error('Error al actualizar diseñador:', err);
    }
  };

  const handleEliminar = async (clave) => {
    if (window.confirm('¿Estás seguro de eliminar este diseñador?')) {
      try {
        await axios.delete(`${BASE_URL}/diseniadores/${clave}`);
        obtenerDiseniadores();
      } catch (err) {
        console.error('Error al eliminar diseñador:', err);
      }
    }
  };

  const filtrados = diseniadores.filter(d =>
    d.NOMBRE.toLowerCase().includes(busqueda.toLowerCase()) ||
    d.AP_PAT?.toLowerCase().includes(busqueda.toLowerCase())
  );
  const totalPaginas = Math.ceil(filtrados.length / itemsPorPagina);
  const indiceInicial = (paginaActual - 1) * itemsPorPagina;
  const currentItems = filtrados.slice(indiceInicial, indiceInicial + itemsPorPagina);

  return (
    <div className="container mt-4">
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Buscar por nombre o apellido..."
        value={busqueda}
        onChange={(e) => {
          setBusqueda(e.target.value);
          setPaginaActual(1);
        }}
      />

      <table className="table table-bordered table-hover text-center">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Editar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((d, index) => (
            <tr key={d.CLAVE}>
              <td>{indiceInicial + index + 1}</td>
              <td>{d.NOMBRE}</td>
              <td>{d.AP_PAT}</td>
              <td>
                <button className="btn btn-warning btn-sm" onClick={() => handleEditar(d)}>
                  <FaEdit />
                </button>
              </td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(d.CLAVE)}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-center mb-3">
        <nav>
          <ul className="pagination">
            <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setPaginaActual(paginaActual - 1)}>«</button>
            </li>
            {Array.from({ length: totalPaginas }, (_, i) => (
              <li key={i} className={`page-item ${paginaActual === i + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setPaginaActual(i + 1)}>{i + 1}</button>
              </li>
            ))}
            <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setPaginaActual(paginaActual + 1)}>»</button>
            </li>
          </ul>
        </nav>
      </div>

      <div className="card p-3">
        <h5 className="mb-3">{editando ? 'Editar Diseñador' : 'Agregar Diseñador'}</h5>
        <div className="row">
          <div className="col-md-6 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div className="col-md-6 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Apellido Paterno"
              value={apPat}
              onChange={(e) => setApPat(e.target.value)}
            />
          </div>
        </div>
        <button className="btn btn-success w-100" onClick={editando ? handleActualizar : handleAgregar}>
          {editando ? 'Actualizar' : 'Agregar'}
        </button>
      </div>
    </div>
  );
};

export default DiseniadoresTable;
