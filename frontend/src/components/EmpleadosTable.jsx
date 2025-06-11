import React, { useEffect, useState } from 'react';
import { FaEye, FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
import './EmpleadosModal.css';

const EmpleadosTable = () => {
  const [empleados, setEmpleados] = useState([]);
  const [form, setForm] = useState({});
  const [editando, setEditando] = useState(false);
  const [claveEditando, setClaveEditando] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [roles, setRoles] = useState([]);

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
    try {
      const res = await fetch(ROL_URL);
      const data = await res.json();
      // Convertir el arreglo a objetos si vienen como arrays [CLAVE, NOMBRE]
      const parsed = data.map(r => ({ CLAVE: r[0], NOMBRE: r[1] }));
      setRoles(parsed);
    } catch (err) {
      console.error('Error cargando roles', err);
    }
  };

  const generarClaveUnica = () => {
    const sufijo = Math.floor(Math.random() * 9000) + 1000;
    return `EMP${sufijo}`;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const metodo = editando ? 'PUT' : 'POST';
    const endpoint = editando ? `${URL}/${claveEditando}` : URL;
    const payload = editando ? form : { ...form, CLAVE: generarClaveUnica() };

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
    }
  };

  const handleEditar = (empleado) => {
    setForm(empleado);
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
    const termino = busqueda.toLowerCase();
    return (
      emp.CLAVE?.toLowerCase().includes(termino) ||
      emp.NOMBRE?.toLowerCase().includes(termino) ||
      emp.APELLIDO_PAT?.toLowerCase().includes(termino) ||
      emp.CORREO?.toLowerCase().includes(termino) ||
      emp.ROL?.toLowerCase().includes(termino)
    );
  });

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

      <table className="table table-bordered text-center">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>CLAVE</th>
            <th>NOMBRE</th>
            <th>APELLIDO PAT</th>
            <th>CORREO</th>
            <th>ROL</th>
            <th>Ver</th>
            <th>Editar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {empleadosFiltrados.map((emp, index) => (
            <tr key={emp.CLAVE}>
              <td>{index + 1}</td>
              <td>{emp.CLAVE}</td>
              <td>{emp.NOMBRE}</td>
              <td>{emp.APELLIDO_PAT}</td>
              <td>{emp.CORREO}</td>
              <td>{emp.ROL}</td>
              <td><button className="btn btn-outline-primary"><FaEye /></button></td>
              <td><button onClick={() => handleEditar(emp)} className="btn btn-warning"><FaEdit /></button></td>
              <td><button onClick={() => handleEliminar(emp.CLAVE)} className="btn btn-danger"><FaTrash /></button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        className="btn btn-danger rounded-circle position-fixed"
        style={{ bottom: '40px', right: '40px', width: '60px', height: '60px' }}
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
            <div className="modal-header d-flex justify-content-between align-items-center mb-2">
              <h5>{editando ? 'Editar empleado' : 'Agregar nuevo empleado'}</h5>
              <button onClick={() => setMostrarFormulario(false)} className="btn btn-sm"><FaTimes /></button>
            </div>
            <form onSubmit={handleSubmit} className="row g-2">
              <div className="col-md-6">
                <input name="NOMBRE" placeholder="NOMBRE" value={form.NOMBRE || ''} onChange={handleChange} required className="form-control" />
              </div>
              <div className="col-md-6">
                <input name="APELLIDO_PAT" placeholder="APELLIDO PAT" value={form.APELLIDO_PAT || ''} onChange={handleChange} className="form-control" />
              </div>
              <div className="col-md-6">
                <input name="CORREO" placeholder="CORREO" value={form.CORREO || ''} onChange={handleChange} className="form-control" />
              </div>
              <div className="col-md-6">
                <select name="ROL" value={form.ROL || ''} onChange={handleChange} className="form-select" required>
                  <option value="">Seleccione un rol</option>
                  {roles.map(r => (
                    <option key={r.CLAVE} value={r.NOMBRE}>{r.NOMBRE}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-12 d-grid mt-3">
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

export default EmpleadosTable;
