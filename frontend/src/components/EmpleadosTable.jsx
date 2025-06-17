import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';

const EmpleadosTable = () => {
  const [empleados, setEmpleados] = useState([]);
  const [form, setForm] = useState({});
  const [editando, setEditando] = useState(false);
  const [claveEditando, setClaveEditando] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [roles, setRoles] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const porPagina = 10;

  const URL = 'http://localhost:3000/api/empleados';
  const ROL_URL = 'http://localhost:3000/api/roles';

  useEffect(() => {
    obtenerEmpleados();
    obtenerRoles();
  }, []);

  const obtenerEmpleados = async () => {
    const res = await fetch(URL);
    const data = await res.json();
    setEmpleados(data);
  };

  const obtenerRoles = async () => {
    const res = await fetch(ROL_URL);
    const data = await res.json();
    setRoles(data);
  };

  const generarClaveUnica = () => `EMP${Math.floor(Math.random() * 9000) + 1000}`;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const metodo = editando ? 'PUT' : 'POST';
    const endpoint = editando ? `${URL}/${claveEditando}` : URL;
    const claveRol = roles.find(r => r.NOMBRE === form.ROL)?.CLAVE;

    if (!form.NOMBRE || !form.CORREO || !claveRol) return alert('❌ Faltan datos');

    const payload = {
      ...(editando ? {} : { CLAVE: generarClaveUnica() }),
      NOMBRE: form.NOMBRE,
      APELLIDO_PAT: form.APELLIDO_PAT || '',
      CORREO: form.CORREO,
      CLAVE_ROL: claveRol
    };

    const res = await fetch(endpoint, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      obtenerEmpleados();
      setForm({});
      setEditando(false);
      setMostrarFormulario(false);
    } else {
      const msg = await res.text();
      alert('❌ Error: ' + msg);
    }
  };

  const handleEditar = (empleado) => {
    setForm({
      NOMBRE: empleado.NOMBRE,
      APELLIDO_PAT: empleado.APELLIDO_PAT,
      CORREO: empleado.CORREO,
      ROL: empleado.ROL
    });
    setEditando(true);
    setClaveEditando(empleado.CLAVE);
    setMostrarFormulario(true);
  };

  const handleEliminar = async (clave) => {
    if (window.confirm('¿Eliminar empleado?')) {
      const res = await fetch(`${URL}/${clave}`, { method: 'DELETE' });
      if (res.ok) obtenerEmpleados();
    }
  };

  const empleadosFiltrados = empleados.filter(emp => {
    const texto = busqueda.toLowerCase();
    return (
      (emp.CLAVE || '').toLowerCase().includes(texto) ||
      (emp.NOMBRE || '').toLowerCase().includes(texto) ||
      (emp.APELLIDO_PAT || '').toLowerCase().includes(texto) ||
      (emp.CORREO || '').toLowerCase().includes(texto) ||
      (emp.ROL || '').toLowerCase().includes(texto)
    );
  });

  const totalPaginas = Math.ceil(empleadosFiltrados.length / porPagina);
  const empleadosPagina = empleadosFiltrados.slice((paginaActual - 1) * porPagina, paginaActual * porPagina);

  return (
    <div className="container position-relative">
      <h2 className="text-center my-4">Catálogo de Empleados</h2>
      <input
        type="text"
        placeholder="Buscar..."
        className="form-control mb-3"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <table className="table table-bordered text-center align-middle">
        <thead className="table-dark">
          <tr>
            <th>#</th><th>CLAVE</th><th>NOMBRE</th><th>APELLIDO PAT</th><th>CORREO</th><th>ROL</th>
            <th>Editar</th><th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {empleadosPagina.map((emp, i) => (
            <tr key={emp.CLAVE}>
              <td>{(paginaActual - 1) * porPagina + i + 1}</td>
              <td>{emp.CLAVE}</td>
              <td>{emp.NOMBRE}</td>
              <td>{emp.APELLIDO_PAT}</td>
              <td>{emp.CORREO}</td>
              <td>{emp.ROL}</td>
              <td><button className="btn btn-warning" onClick={() => handleEditar(emp)}><FaEdit /></button></td>
              <td><button className="btn btn-danger" onClick={() => handleEliminar(emp.CLAVE)}><FaTrash /></button></td>
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
        title="Agregar nuevo empleado"
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
              <h5>{editando ? 'Editar empleado' : 'Agregar nuevo empleado'}</h5>
              <button onClick={() => setMostrarFormulario(false)} className="btn"><FaTimes /></button>
            </div>
            <form onSubmit={handleSubmit} className="row g-2">
              <div className="col-md-6">
                <input name="NOMBRE" placeholder="Nombre" value={form.NOMBRE || ''} onChange={handleChange} className="form-control" required />
              </div>
              <div className="col-md-6">
                <input name="APELLIDO_PAT" placeholder="Apellido Paterno" value={form.APELLIDO_PAT || ''} onChange={handleChange} className="form-control" />
              </div>
              <div className="col-md-6">
                <input name="CORREO" placeholder="Correo" value={form.CORREO || ''} onChange={handleChange} className="form-control" required />
              </div>
              <div className="col-md-6">
                <select name="ROL" value={form.ROL || ''} onChange={handleChange} className="form-select" required>
                  <option value="">Seleccionar rol</option>
                  {roles.map(r => (
                    <option key={r.CLAVE} value={r.NOMBRE}>{r.NOMBRE}</option>
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

export default EmpleadosTable;
