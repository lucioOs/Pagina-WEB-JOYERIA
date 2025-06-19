import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';

const ClientesTable = () => {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({});
  const [editando, setEditando] = useState(false);
  const [claveEditando, setClaveEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const porPagina = 10;

  const URL = 'http://localhost:3000/api/clientes';

  useEffect(() => {
    obtenerClientes();
  }, []);

  const obtenerClientes = async () => {
    const res = await fetch(URL);
    const data = await res.json();
    setClientes(data);
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
      obtenerClientes();
      setForm({});
      setMostrarFormulario(false);
      setEditando(false);
    } else {
      alert('❌ Error al guardar');
    }
  };

  const handleEditar = (cliente) => {
    setForm({
      nombre: cliente.NOMBRE,
      apellido_pat: cliente.APELLIDO_PAT,
      apellido_mat: cliente.APELLIDO_MAT,
      fecha_nac: cliente.FECHA_NAC,
      fecha_reg: cliente.FECHA_REG,
      telefono: cliente.TELEFONO,
      correo: cliente.CORREO,
      foto: cliente.FOTO,
      clave_direccion: cliente.CLAVE_DIRECCION
    });
    setClaveEditando(cliente.CLAVE);
    setEditando(true);
    setMostrarFormulario(true);
  };

  const handleEliminar = async (clave) => {
    if (window.confirm('¿Eliminar cliente?')) {
      const res = await fetch(`${URL}/${clave}`, { method: 'DELETE' });
      if (res.ok) obtenerClientes();
    }
  };

  const filtrar = clientes.filter(c =>
    (c.NOMBRE || '').toLowerCase().includes(busqueda.toLowerCase()) ||
    (c.APELLIDO_PAT || '').toLowerCase().includes(busqueda.toLowerCase()) ||
    (c.APELLIDO_MAT || '').toLowerCase().includes(busqueda.toLowerCase())
  );

  const totalPaginas = Math.ceil(filtrar.length / porPagina);
  const clientesPagina = filtrar.slice((paginaActual - 1) * porPagina, paginaActual * porPagina);

  return (
    <div className="container position-relative">
      <h2 className="text-center my-4">Catálogo de Clientes</h2>
      <input
        type="text"
        placeholder="Buscar por nombre o apellido..."
        className="form-control mb-3"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <table className="table table-bordered text-center align-middle">
        <thead className="table-dark">
          <tr>
            <th>#</th><th>Nombre</th><th>Apellidos</th><th>Teléfono</th><th>Correo</th><th>Foto</th>
            <th>Editar</th><th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {clientesPagina.map((c, i) => (
            <tr key={c.CLAVE}>
              <td>{(paginaActual - 1) * porPagina + i + 1}</td>
              <td>{c.NOMBRE}</td>
              <td>{c.APELLIDO_PAT} {c.APELLIDO_MAT}</td>
              <td>{c.TELEFONO}</td>
              <td>{c.CORREO}</td>
              <td>{c.FOTO && <img src={c.FOTO} alt="foto" width="50" />}</td>
              <td><button className="btn btn-warning" onClick={() => handleEditar(c)}><FaEdit /></button></td>
              <td><button className="btn btn-danger" onClick={() => handleEliminar(c.CLAVE)}><FaTrash /></button></td>
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
        title="Agregar nuevo cliente"
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
              <h5>{editando ? 'Editar cliente' : 'Agregar nuevo cliente'}</h5>
              <button onClick={() => setMostrarFormulario(false)} className="btn"><FaTimes /></button>
            </div>
            <form className="row g-2" onSubmit={handleSubmit}>
              <div className="col-md-6">
                <input name="nombre" placeholder="Nombre" value={form.nombre || ''} onChange={handleChange} className="form-control" required />
              </div>
              <div className="col-md-6">
                <input name="apellido_pat" placeholder="Apellido Paterno" value={form.apellido_pat || ''} onChange={handleChange} className="form-control" required />
              </div>
              <div className="col-md-6">
                <input name="apellido_mat" placeholder="Apellido Materno" value={form.apellido_mat || ''} onChange={handleChange} className="form-control" required />
              </div>
              <div className="col-md-6">
                <input type="date" name="fecha_nac" value={form.fecha_nac || ''} onChange={handleChange} className="form-control" required />
              </div>
              <div className="col-md-6">
                <input type="date" name="fecha_reg" value={form.fecha_reg || ''} onChange={handleChange} className="form-control" required />
              </div>
              <div className="col-md-6">
                <input name="telefono" placeholder="Teléfono" value={form.telefono || ''} onChange={handleChange} className="form-control" required />
              </div>
              <div className="col-md-6">
                <input name="correo" placeholder="Correo" value={form.correo || ''} onChange={handleChange} className="form-control" required />
              </div>
              <div className="col-md-6">
                <input name="foto" placeholder="URL de la foto" value={form.foto || ''} onChange={handleChange} className="form-control" />
              </div>
              <div className="col-12">
                <input name="clave_direccion" placeholder="Clave de Dirección" value={form.clave_direccion || ''} onChange={handleChange} className="form-control" required />
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

export default ClientesTable;
