import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';

const JoyasTable = () => {
  const [joyas, setJoyas] = useState([]);
  const [form, setForm] = useState({});
  const [editando, setEditando] = useState(false);
  const [claveEditando, setClaveEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [tipos, setTipos] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const porPagina = 10;

  const URL = 'http://localhost:3000/api/joyas';

  useEffect(() => {
    obtenerJoyas();
    fetch('http://localhost:3000/api/joyas/tipos').then(res => res.json()).then(setTipos);
    fetch('http://localhost:3000/api/joyas/materiales').then(res => res.json()).then(setMateriales);
  }, []);

  const obtenerJoyas = async () => {
    const res = await fetch(URL);
    const data = await res.json();
    setJoyas(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const metodo = editando ? 'PUT' : 'POST';
    const endpoint = editando ? `${URL}/${claveEditando}` : URL;
    const res = await fetch(endpoint, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      obtenerJoyas();
      setForm({});
      setMostrarFormulario(false);
      setEditando(false);
    } else {
      alert('❌ Error al guardar');
    }
  };

  const handleEditar = (joya) => {
    setForm({
      nombre: joya.NOMBRE,
      descripcion: joya.DESCRIPCION,
      precio: joya.PRECIO,
      inventario: joya.INVENTARIO,
      tipo: joya.TIPO,
      material: joya.MATERIAL,
      foto: joya.FOTO
    });
    setClaveEditando(joya.CLAVE);
    setEditando(true);
    setMostrarFormulario(true);
  };

  const handleEliminar = async (clave) => {
    if (window.confirm('¿Eliminar joya?')) {
      const res = await fetch(`${URL}/${clave}`, { method: 'DELETE' });
      if (res.ok) obtenerJoyas();
    }
  };

  const filtrar = joyas.filter(j =>
  String(j.NOMBRE || '').toLowerCase().includes(busqueda.toLowerCase()) ||
  String(j.TIPO || '').toLowerCase().includes(busqueda.toLowerCase()) ||
  String(j.MATERIAL || '').toLowerCase().includes(busqueda.toLowerCase())
);


  const totalPaginas = Math.ceil(filtrar.length / porPagina);
  const joyasPagina = filtrar.slice((paginaActual - 1) * porPagina, paginaActual * porPagina);

  return (
    <div className="container position-relative">
      <h2 className="text-center my-4">Catálogo de Joyas</h2>
      <input
        type="text"
        placeholder="Buscar por nombre, tipo o material..."
        className="form-control mb-3"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <table className="table table-bordered text-center align-middle">
        <thead className="table-dark">
          <tr>
            <th>#</th><th>Nombre</th><th>Descripción</th><th>Precio</th><th>Inventario</th><th>Tipo</th><th>Material</th><th>Foto</th>
            <th>Editar</th><th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {joyasPagina.map((j, i) => (
            <tr key={j.CLAVE}>
              <td>{(paginaActual - 1) * porPagina + i + 1}</td>
              <td>{j.NOMBRE}</td>
              <td>{j.DESCRIPCION}</td>
              <td>${j.PRECIO}</td>
              <td>{j.INVENTARIO}</td>
              <td>{j.TIPO}</td>
              <td>{j.MATERIAL}</td>
              <td>
                {j.FOTO && <img src={j.FOTO} alt={j.NOMBRE} width="60" />}
              </td>
              <td><button className="btn btn-warning" onClick={() => handleEditar(j)}><FaEdit /></button></td>
              <td><button className="btn btn-danger" onClick={() => handleEliminar(j.CLAVE)}><FaTrash /></button></td>
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
        title="Agregar nueva joya"
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

      {/* Formulario modal */}
      {mostrarFormulario && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="d-flex justify-content-between mb-2">
              <h5>{editando ? 'Editar joya' : 'Agregar nueva joya'}</h5>
              <button onClick={() => setMostrarFormulario(false)} className="btn"><FaTimes /></button>
            </div>
            <form className="row g-2" onSubmit={handleSubmit}>
              <div className="col-md-6">
                <input name="nombre" placeholder="Nombre" value={form.nombre || ''} onChange={handleChange} className="form-control" required />
              </div>
              <div className="col-md-6">
                <input name="descripcion" placeholder="Descripción" value={form.descripcion || ''} onChange={handleChange} className="form-control" required />
              </div>
              <div className="col-md-6">
                <input name="precio" type="number" placeholder="Precio" value={form.precio || ''} onChange={handleChange} className="form-control" required />
              </div>
              <div className="col-md-6">
                <input name="inventario" type="number" placeholder="Inventario" value={form.inventario || ''} onChange={handleChange} className="form-control" required />
              </div>
              <div className="col-md-6">
                <select name="tipo" value={form.tipo || ''} onChange={handleChange} className="form-select" required>
                  <option value="">Seleccionar tipo</option>
                  {tipos.map(t => (
                    <option key={t.CLAVE} value={t.NOMBRE}>{t.NOMBRE}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <select name="material" value={form.material || ''} onChange={handleChange} className="form-select" required>
                  <option value="">Seleccionar material</option>
                  {materiales.map(m => (
                    <option key={m.CLAVE} value={m.NOMBRE}>{m.NOMBRE}</option>
                  ))}
                </select>
              </div>
              <div className="col-12">
                <input name="foto" placeholder="URL de la imagen" value={form.foto || ''} onChange={handleChange} className="form-control" />
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

export default JoyasTable;
