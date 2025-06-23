import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import { BASE_URL } from '../config';

const ClientesTable = () => {
  const [clientes, setClientes] = useState([]);
  const [estados, setEstados] = useState([]);
  const [form, setForm] = useState({
    nombre: '', apellido_pat: '', apellido_mat: '',
    fecha_nac: '', fecha_reg: '',
    telefono: '', correo: '', foto: '',
    direccion: { estado: '', municipio: '', cp: '', colonia: '', calle: '', num_int: '', num_ext: '' }
  });
  const [editando, setEditando] = useState(false);
  const [claveEditando, setClaveEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const porPagina = 10;
  const URL = `${BASE_URL}/clientes`;

  useEffect(() => {
    fetchEstados();
    fetchClientes();
  }, []);

  const fetchEstados = async () => {
    try {
      const res = await fetch(`${BASE_URL}/estados`);
      const data = await res.json();
      if (Array.isArray(data)) {
        const formateados = data.map(([CLAVE, NOMBRE]) => ({ CLAVE, NOMBRE }));
        setEstados(formateados);
      } else {
        console.error('La respuesta de estados no es un arreglo', data);
        setEstados([]);
      }
    } catch (err) {
      console.error('Error al obtener estados:', err);
      setEstados([]);
    }
  };

  const fetchClientes = async () => {
    try {
      const res = await fetch(URL);
      const data = await res.json();
      setClientes(data);
    } catch (err) {
      console.error('Error al obtener clientes:', err);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    if (name.startsWith('direccion.')) {
      const campo = name.split('.')[1];
      setForm(prev => ({
        ...prev,
        direccion: { ...prev.direccion, [campo]: value }
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const iniciarAgregar = () => {
    setForm({
      nombre: '', apellido_pat: '', apellido_mat: '',
      fecha_nac: '', fecha_reg: '',
      telefono: '', correo: '', foto: '',
      direccion: { estado: '', municipio: '', cp: '', colonia: '', calle: '', num_int: '', num_ext: '' }
    });
    setEditando(false);
    setMostrarFormulario(true);
  };

  const handleEditar = cliente => {
    setForm({
      nombre: cliente.NOMBRE,
      apellido_pat: cliente.APELLIDO_PAT,
      apellido_mat: cliente.APELLIDO_MAT,
      fecha_nac: cliente.FECHA_NAC,
      fecha_reg: cliente.FECHA_REG,
      telefono: cliente.TELEFONO,
      correo: cliente.CORREO,
      foto: cliente.FOTO,
      direccion: {
        estado: cliente.ESTADO_CLAVE,
        municipio: cliente.MUNICIPIO,
        cp: cliente.CP,
        colonia: cliente.COLONIA,
        calle: cliente.CALLE,
        num_int: cliente.NUM_INT,
        num_ext: cliente.NUM_EXT
      }
    });
    setClaveEditando(cliente.CLAVE);
    setEditando(true);
    setMostrarFormulario(true);
  };

  const handleSubmit = async e => {
  e.preventDefault();
  const method = editando ? 'PUT' : 'POST';
  const endpoint = editando ? `${URL}/${claveEditando}` : URL;

  // Conversión segura de datos
  const datos = {
    ...form,
    direccion: {
      ...form.direccion,
      estado: Number(form.direccion.estado),
      cp: Number(form.direccion.cp) || 0,
      num_int: Number(form.direccion.num_int) || 0,
      num_ext: form.direccion.num_ext || '',
    }
  };

  try {
    const res = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    if (res.ok) {
      fetchClientes();
      setMostrarFormulario(false);
      setEditando(false);
    } else {
      const errorTexto = await res.text();
      throw new Error(errorTexto);
    }
  } catch (err) {
    alert('❌ Error: ' + err.message);
    console.error(err);
  }
};


  const handleEliminar = async clave => {
    if (window.confirm('¿Eliminar cliente?')) {
      try {
        const res = await fetch(`${URL}/${clave}`, { method: 'DELETE' });
        if (res.ok) fetchClientes();
        else throw new Error(await res.text());
      } catch (err) {
        alert('❌ No se pudo eliminar: ' + err.message);
      }
    }
  };

  const filtrados = clientes.filter(c =>
    (c.NOMBRE + ' ' + c.APELLIDO_PAT + ' ' + c.APELLIDO_MAT)
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  const totalPaginas = Math.ceil(filtrados.length / porPagina);
  const desde = (paginaActual - 1) * porPagina;
  const visibles = filtrados.slice(desde, desde + porPagina);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-3">Catálogo de Clientes</h2>
      <div className="d-flex mb-3">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Buscar cliente..."
          value={busqueda}
          onChange={e => { setBusqueda(e.target.value); setPaginaActual(1); }}
        />
        <button className="btn btn-success" onClick={iniciarAgregar}>
          <FaPlus /> Agregar
        </button>
      </div>

      <table className="table table-striped table-bordered text-center">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Nombre Completo</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th>Estado</th>
            <th>Cp</th>
            <th>Colonia</th>
            <th>Calle</th>
            <th>Int/Ext</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {visibles.map((c, i) => (
            <tr key={c.CLAVE}>
              <td>{desde + i + 1}</td>
              <td>{`${c.NOMBRE} ${c.APELLIDO_PAT} ${c.APELLIDO_MAT}`}</td>
              <td>{c.TELEFONO}</td>
              <td>{c.CORREO}</td>
              <td>{c.ESTADO}</td>
              <td>{c.CP}</td>
              <td>{c.COLONIA}</td>
              <td>{c.CALLE}</td>
              <td>{`${c.NUM_INT || '-'} / ${c.NUM_EXT || '-'}`}</td>
              <td>
                <button className="btn btn-warning btn-sm me-1" onClick={() => handleEditar(c)}>
                  <FaEdit />
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(c.CLAVE)}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setPaginaActual(1)}>⏮</button>
          </li>
          <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setPaginaActual(paginaActual - 1)}>◀</button>
          </li>
          {[...Array(totalPaginas)].map((_, idx) => (
            <li key={idx} className={`page-item ${paginaActual === idx + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => setPaginaActual(idx + 1)}>{idx + 1}</button>
            </li>
          ))}
          <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setPaginaActual(paginaActual + 1)}>▶</button>
          </li>
          <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setPaginaActual(totalPaginas)}>⏭</button>
          </li>
        </ul>
      </nav>

      {/* Formulario */}
      {mostrarFormulario && (
        <div className="modal-overlay">
          <div className="modal-content p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5>{editando ? 'Editar Cliente' : 'Agregar Cliente'}</h5>
              <button className="btn btn-outline-secondary" onClick={() => setMostrarFormulario(false)}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                {/* Campos cliente */}
                <div className="col-md-6">
                  <label>Nombre</label>
                  <input className="form-control" name="nombre" value={form.nombre} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label>Apellido Paterno</label>
                  <input className="form-control" name="apellido_pat" value={form.apellido_pat} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label>Apellido Materno</label>
                  <input className="form-control" name="apellido_mat" value={form.apellido_mat} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label>Fecha de Nacimiento</label>
                  <input type="date" className="form-control" name="fecha_nac" value={form.fecha_nac} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label>Fecha de Registro</label>
                  <input type="date" className="form-control" name="fecha_reg" value={form.fecha_reg} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label>Teléfono</label>
                  <input className="form-control" name="telefono" value={form.telefono} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label>Correo</label>
                  <input type="email" className="form-control" name="correo" value={form.correo} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label>URL de Foto (opcional)</label>
                  <input className="form-control" name="foto" value={form.foto} onChange={handleChange} />
                </div>

                {/* Dirección */}
                <hr />
                <div className="col-md-6">
                  <label>Estado</label>
                  <select className="form-select" name="direccion.estado" value={form.direccion.estado} onChange={handleChange} required>
                    <option value="">Selecciona un estado</option>
                    {estados.map(est => (
                      <option key={est.CLAVE} value={est.CLAVE}>{est.NOMBRE}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label>Municipio</label>
                  <input className="form-control" name="direccion.municipio" value={form.direccion.municipio} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label>Código Postal</label>
                  <input className="form-control" name="direccion.cp" value={form.direccion.cp} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label>Colonia</label>
                  <input className="form-control" name="direccion.colonia" value={form.direccion.colonia} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label>Calle</label>
                  <input className="form-control" name="direccion.calle" value={form.direccion.calle} onChange={handleChange} required />
                </div>
                <div className="col-md-3">
                  <label>Número Int.</label>
                  <input className="form-control" name="direccion.num_int" value={form.direccion.num_int} onChange={handleChange} />
                </div>
                <div className="col-md-3">
                  <label>Número Ext.</label>
                  <input className="form-control" name="direccion.num_ext" value={form.direccion.num_ext} onChange={handleChange} />
                </div>

                <div className="col-12 text-end mt-3">
                  <button type="button" className="btn btn-secondary me-2" onClick={() => setMostrarFormulario(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">
                    {editando ? 'Guardar Cambios' : 'Agregar Cliente'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientesTable;
