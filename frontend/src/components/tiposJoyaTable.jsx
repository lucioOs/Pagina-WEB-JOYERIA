import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';

const TipoJoyaTable = () => {
  const [tipos, setTipos] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [form, setForm] = useState({});
  const [editando, setEditando] = useState(false);
  const [claveEditando, setClaveEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const porPagina = 10;

  const URL = 'http://localhost:3000/api/tipojoya';
  const URL_MATERIAL = 'http://localhost:3000/api/materiales';

  useEffect(() => {
    obtenerTipos();
    obtenerMateriales();
  }, []);

  const obtenerTipos = async () => {
    const res = await fetch(URL);
    const data = await res.json();
    setTipos(data);
  };

  const obtenerMateriales = async () => {
    const res = await fetch(URL_MATERIAL);
    const data = await res.json();
    setMateriales(data);
  };

  const generarClave = () => {
    const claves = tipos.map(t => parseInt(t.CLAVE)).filter(n => !isNaN(n));
    return Math.max(...claves, 0) + 1;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const metodo = editando ? 'PUT' : 'POST';
    const endpoint = editando ? `${URL}/${claveEditando}` : URL;
    const payload = editando
      ? form
      : { CLAVE: generarClave(), ...form };

    const res = await fetch(endpoint, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      obtenerTipos();
      setForm({});
      setMostrarFormulario(false);
      setEditando(false);
    } else {
      alert('❌ Error al guardar');
    }
  };

  const handleEditar = (tipo) => {
    const materialEncontrado = materiales.find(m => m.NOMBRE === tipo.MATERIAL);
    setForm({
      NOMBRE: tipo.NOMBRE,
      MATERIAL_CLAVE: materialEncontrado?.CLAVE || ''
    });
    setClaveEditando(tipo.CLAVE);
    setEditando(true);
    setMostrarFormulario(true);
  };

  const handleEliminar = async (clave) => {
    if (window.confirm('¿Eliminar tipo de joya?')) {
      const res = await fetch(`${URL}/${clave}`, { method: 'DELETE' });
      if (res.ok) obtenerTipos();
    }
  };

  const filtrar = tipos.filter(t =>
    (t.NOMBRE || '').toLowerCase().includes(busqueda.toLowerCase()) ||
    (t.MATERIAL || '').toLowerCase().includes(busqueda.toLowerCase())
  );

  const totalPaginas = Math.ceil(filtrar.length / porPagina);
  const tiposPagina = filtrar.slice((paginaActual - 1) * porPagina, paginaActual * porPagina);

  return (
    <div className="container position-relative">
      <h2 className="text-center my-4">Catálogo de Tipos de Joya</h2>
      <input
        type="text"
        placeholder="Buscar por nombre o material..."
        className="form-control mb-3"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <table className="table table-bordered text-center align-middle">
        <thead className="table-dark">
          <tr>
            <th>#</th><th>CLAVE</th><th>NOMBRE</th><th>MATERIAL</th>
            <th>Editar</th><th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {tiposPagina.map((t, i) => (
            <tr key={t.CLAVE}>
              <td>{(paginaActual - 1) * porPagina + i + 1}</td>
              <td>{t.CLAVE}</td>
              <td>{t.NOMBRE}</td>
              <td>{t.MATERIAL}</td>
              <td><button className="btn btn-warning" onClick={() => handleEditar(t)}><FaEdit /></button></td>
              <td><button className="btn btn-danger" onClick={() => handleEliminar(t.CLAVE)}><FaTrash /></button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
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
        title="Agregar tipo de joya"
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
              <h5>{editando ? 'Editar tipo de joya' : 'Agregar tipo de joya'}</h5>
              <button onClick={() => setMostrarFormulario(false)} className="btn"><FaTimes /></button>
            </div>
            <form className="row g-2" onSubmit={handleSubmit}>
              <div className="col-md-6">
                <input name="NOMBRE" placeholder="Nombre" value={form.NOMBRE || ''} onChange={handleChange} className="form-control" required />
              </div>
              <div className="col-md-6">
                <select name="MATERIAL_CLAVE" value={form.MATERIAL_CLAVE || ''} onChange={handleChange} className="form-select" required>
                  <option value="">Seleccionar material</option>
                  {materiales.map(m => (
                    <option key={m.CLAVE} value={m.CLAVE}>{m.NOMBRE}</option>
                  ))}
                </select>
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

export default TipoJoyaTable;
