// src/components/EmpleadosTable.jsx
// src/components/EmpleadosTable.jsx
import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import { BASE_URL } from '../config';

const EmpleadosTable = () => {
  const [empleados, setEmpleados] = useState([]);
  const [estados, setEstados] = useState([]);
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({
    nombre: '', apellido_pat: '', apellido_mat: '',
    fecha_nac: '', fecha_reg: '',
    telefono: '', correo: '', rol: '',
    direccion: { estado: '', municipio: '', cp: '', colonia: '', calle: '', num_int: '', num_ext: '' }
  });
  const [editando, setEditando] = useState(false);
  const [claveEditando, setClaveEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const porPagina = 10;
  const URL = `${BASE_URL}/empleados`;

  useEffect(() => {
    fetchEstados();
    fetchRoles();
    fetchEmpleados();
  }, []);

  const fetchEstados = async () => {
    try {
      const res = await fetch(`${BASE_URL}/estados`);
      const data = await res.json();
      if (Array.isArray(data)) {
        const formateados = data.map(([CLAVE, NOMBRE]) => ({ CLAVE, NOMBRE }));
        setEstados(formateados);
      }
    } catch (err) {
      console.error('Error al obtener estados:', err);
    }
  };

  const fetchRoles = async () => {
    const res = await fetch(`${BASE_URL}/roles`);
    const data = await res.json();
    setRoles(data);
  };

  const fetchEmpleados = async () => {
    try {
      const res = await fetch(URL);
      const data = await res.json();
      setEmpleados(data);
    } catch (err) {
      console.error('Error al obtener empleados:', err);
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
      telefono: '', correo: '', rol: '',
      direccion: { estado: '', municipio: '', cp: '', colonia: '', calle: '', num_int: '', num_ext: '' }
    });
    setEditando(false);
    setMostrarFormulario(true);
  };

  const handleEditar = empleado => {
    setForm({
      nombre: empleado.NOMBRE,
      apellido_pat: empleado.APELLIDO_PAT,
      apellido_mat: empleado.APELLIDO_MAT,
      fecha_nac: empleado.FECHA_NAC,
      fecha_reg: empleado.FECHA_REG,
      telefono: empleado.TELEFONO,
      correo: empleado.CORREO,
      rol: empleado.ROL,
      direccion: {
        estado: empleado.ESTADO_CLAVE,
        municipio: empleado.MUNICIPIO,
        cp: empleado.CP,
        colonia: empleado.COLONIA,
        calle: empleado.CALLE,
        num_int: empleado.NUM_INT,
        num_ext: empleado.NUM_EXT
      }
    });
    setClaveEditando(empleado.CLAVE);
    setEditando(true);
    setMostrarFormulario(true);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const method = editando ? 'PUT' : 'POST';
    const endpoint = editando ? `${URL}/${claveEditando}` : URL;

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
        fetchEmpleados();
        setMostrarFormulario(false);
        setEditando(false);
      } else {
        throw new Error(await res.text());
      }
    } catch (err) {
      alert('❌ Error: ' + err.message);
    }
  };

  const handleEliminar = async clave => {
    if (window.confirm('¿Eliminar empleado?')) {
      const res = await fetch(`${URL}/${clave}`, { method: 'DELETE' });
      if (res.ok) fetchEmpleados();
    }
  };

  const filtrados = empleados.filter(e =>
    (e.NOMBRE + ' ' + e.APELLIDO_PAT + ' ' + e.APELLIDO_MAT)
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  const totalPaginas = Math.ceil(filtrados.length / porPagina);
  const desde = (paginaActual - 1) * porPagina;
  const visibles = filtrados.slice(desde, desde + porPagina);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-3">Empleados</h2>
      <div className="d-flex mb-3">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Buscar empleado..."
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
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Calle</th>
            <th>Int/Ext</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {visibles.map((e, i) => (
            <tr key={e.CLAVE}>
              <td>{desde + i + 1}</td>
              <td>{`${e.NOMBRE} ${e.APELLIDO_PAT || ''} ${e.APELLIDO_MAT || ''}`}</td>
              <td>{e.CORREO}</td>
              <td>{e.ROL}</td>
              <td>{e.ESTADO}</td>
              <td>{e.CALLE}</td>
              <td>{`${e.NUM_INT || '-'} / ${e.NUM_EXT || '-'}`}</td>
              <td>
                <button className="btn btn-warning btn-sm me-1" onClick={() => handleEditar(e)}><FaEdit /></button>
                <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(e.CLAVE)}><FaTrash /></button>
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

      {/* Modal Formulario */}
      {mostrarFormulario && (
        <div className="modal-overlay">
          <div className="modal-content p-4">
            <div className="d-flex justify-content-between">
              <h5>{editando ? 'Editar Empleado' : 'Agregar Empleado'}</h5>
              <button className="btn btn-outline-secondary" onClick={() => setMostrarFormulario(false)}><FaTimes /></button>
            </div>
            <form onSubmit={handleSubmit} className="row g-3 mt-2">
              <div className="col-md-6">
                <input name="nombre" className="form-control" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <input name="apellido_pat" className="form-control" placeholder="Apellido Paterno" value={form.apellido_pat} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <input name="apellido_mat" className="form-control" placeholder="Apellido Materno" value={form.apellido_mat} onChange={handleChange} />
              </div>
              <div className="col-md-6">
  <label className="form-label">Fecha de nacimiento</label>
  <input type="date" name="fecha_nac" className="form-control" value={form.fecha_nac} onChange={handleChange} required />
</div>
<div className="col-md-6">
  <label className="form-label">Fecha de registro</label>
  <input type="date" name="fecha_reg" className="form-control" value={form.fecha_reg} onChange={handleChange} required />
</div>

              <div className="col-md-6">
                <input name="telefono" className="form-control" placeholder="Teléfono" value={form.telefono} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <input type="email" name="correo" className="form-control" placeholder="Correo" value={form.correo} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <select name="rol" className="form-select" value={form.rol} onChange={handleChange} required>
                  <option value="">Selecciona un rol</option>
                  {roles.map(r => (
                    <option key={r.CLAVE} value={r.NOMBRE}>{r.NOMBRE}</option>
                  ))}
                </select>
              </div>

              {/* Dirección */}
              <hr />
              <div className="col-md-6">
                <select name="direccion.estado" className="form-select" value={form.direccion.estado} onChange={handleChange} required>
                  <option value="">Selecciona un estado</option>
                  {estados.map(est => (
                    <option key={est.CLAVE} value={est.CLAVE}>{est.NOMBRE}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <input name="direccion.municipio" className="form-control" placeholder="Municipio" value={form.direccion.municipio} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <input name="direccion.cp" className="form-control" placeholder="Código Postal" value={form.direccion.cp} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <input name="direccion.colonia" className="form-control" placeholder="Colonia" value={form.direccion.colonia} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <input name="direccion.calle" className="form-control" placeholder="Calle" value={form.direccion.calle} onChange={handleChange} />
              </div>
              <div className="col-md-3">
                <input name="direccion.num_int" className="form-control" placeholder="Núm. Int." value={form.direccion.num_int} onChange={handleChange} />
              </div>
              <div className="col-md-3">
                <input name="direccion.num_ext" className="form-control" placeholder="Núm. Ext." value={form.direccion.num_ext} onChange={handleChange} />
              </div>

              <div className="col-12 text-end mt-2">
                <button type="submit" className="btn btn-primary">{editando ? 'Actualizar' : 'Agregar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmpleadosTable;
