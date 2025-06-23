import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config'; // Asegúrate de tener esto en tu config.js

const DireccionEmpleadosTable = () => {
  const [direcciones, setDirecciones] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [estados, setEstados] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [formulario, setFormulario] = useState({
    ESTADO: '', MUNICIPIO: '', CP: '', COLONIA: '', CALLE: '',
    NUM_INT: '', NUM_EXT: '', CLAVE_EMPLEADO: ''
  });
  const [editando, setEditando] = useState(false);
  const [claveEditando, setClaveEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [paginaActual, setPaginaActual] = useState(1);
  const direccionesPorPagina = 5;

  useEffect(() => {
    obtenerDirecciones();
    obtenerEmpleados();
    obtenerEstados();
  }, []);

  const obtenerDirecciones = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/direccionempleado`);
      setDirecciones(res.data);
    } catch (err) {
      console.error('Error al obtener direcciones', err);
    }
  };

  const obtenerEmpleados = async () => {
    const res = await axios.get(`${BASE_URL}/empleados`);
    setEmpleados(res.data);
  };

  const obtenerEstados = async () => {
    const res = await axios.get(`${BASE_URL}/estados`);
    setEstados(res.data);
  };

  const handleChange = e => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const limpiarFormulario = () => {
    setFormulario({
      ESTADO: '', MUNICIPIO: '', CP: '', COLONIA: '', CALLE: '',
      NUM_INT: '', NUM_EXT: '', CLAVE_EMPLEADO: ''
    });
    setEditando(false);
    setClaveEditando(null);
  };

  const handleGuardar = async () => {
    try {
      const datos = {
        ...formulario,
        CP: Number(formulario.CP),
        NUM_INT: Number(formulario.NUM_INT),
        CLAVE_EMPLEADO: Number(
          String(formulario.CLAVE_EMPLEADO).replace(/\D/g, '')
        )
      };

      if (editando) {
        await axios.put(`${BASE_URL}/direccionempleado/${claveEditando}`, datos);
      } else {
        await axios.post(`${BASE_URL}/direccionempleado`, datos);
      }

      obtenerDirecciones();
      limpiarFormulario();
      setMostrarFormulario(false);
    } catch (err) {
      console.error('Error al guardar dirección', err);
    }
  };

  const handleEditar = direccion => {
    setFormulario({ ...direccion });
    setEditando(true);
    setClaveEditando(direccion.CLAVE);
    setMostrarFormulario(true);
  };

  const handleEliminar = async clave => {
    if (window.confirm('¿Eliminar esta dirección?')) {
      await axios.delete(`${BASE_URL}/direccionempleado/${clave}`);
      obtenerDirecciones();
    }
  };

  const direccionesFiltradas = direcciones.filter(d =>
    (d.EMPLEADO || '').toLowerCase().includes(busqueda.toLowerCase()) ||
    (d.COLONIA || '').toLowerCase().includes(busqueda.toLowerCase()) ||
    (d.CALLE || '').toLowerCase().includes(busqueda.toLowerCase())
  );

  const totalPaginas = Math.ceil(direccionesFiltradas.length / direccionesPorPagina);
  const direccionesVisibles = direccionesFiltradas.slice(
    (paginaActual - 1) * direccionesPorPagina,
    paginaActual * direccionesPorPagina
  );

  return (
    <div className="container mt-4">
      <h2>Direcciones de Empleados</h2>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Buscar por empleado, calle o colonia"
        value={busqueda}
        onChange={e => {
          setBusqueda(e.target.value);
          setPaginaActual(1);
        }}
      />

      <table className="table table-striped">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Empleado</th>
            <th>Estado</th>
            <th>CP</th>
            <th>Colonia</th>
            <th>Calle</th>
            <th>Int</th>
            <th>Ext</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {direccionesVisibles.map((d, idx) => (
            <tr key={d.CLAVE}>
              <td>{(paginaActual - 1) * direccionesPorPagina + idx + 1}</td>
              <td>{d.EMPLEADO}</td>
              <td>{d.ESTADO}</td>
              <td>{d.CP}</td>
              <td>{d.COLONIA}</td>
              <td>{d.CALLE}</td>
              <td>{d.NUM_INT}</td>
              <td>{d.NUM_EXT}</td>
              <td>
                <button className="btn btn-warning btn-sm me-1" onClick={() => handleEditar(d)}>
                  <i className="bi bi-pencil-fill"></i>
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(d.CLAVE)}>
                  <i className="bi bi-trash-fill"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <nav>
        <ul className="pagination">
          {[...Array(totalPaginas)].map((_, i) => (
            <li key={i} className={`page-item ${paginaActual === i + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => setPaginaActual(i + 1)}>{i + 1}</button>
            </li>
          ))}
        </ul>
      </nav>

      {mostrarFormulario && (
        <div className="mt-4 border rounded p-3 shadow-sm">
          <h5>{editando ? 'Editar Dirección' : 'Agregar Dirección'}</h5>
          <div className="row g-2">
            <div className="col-md-6">
              <label>Empleado:</label>
              <select className="form-select" name="CLAVE_EMPLEADO" value={formulario.CLAVE_EMPLEADO} onChange={handleChange}>
                <option value="">Selecciona un empleado</option>
                {empleados.map(e => (
                  <option key={e.CLAVE} value={e.CLAVE}>
                    {e.NOMBRE} {e.APELLIDO_PAT}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label>Estado:</label>
              <select className="form-select" name="ESTADO" value={formulario.ESTADO} onChange={handleChange}>
                <option value="">Selecciona un estado</option>
                {estados.map(e => (
                  <option key={e.CLAVE} value={e.CLAVE}>
                    {e.NOMBRE}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label>CP:</label>
              <input type="text" className="form-control" name="CP" value={formulario.CP} onChange={handleChange} />
            </div>

            <div className="col-md-6">
              <label>Colonia:</label>
              <input type="text" className="form-control" name="COLONIA" value={formulario.COLONIA} onChange={handleChange} />
            </div>

            <div className="col-md-6">
              <label>Calle:</label>
              <input type="text" className="form-control" name="CALLE" value={formulario.CALLE} onChange={handleChange} />
            </div>

            <div className="col-md-6">
              <label>Número Interior:</label>
              <input type="text" className="form-control" name="NUM_INT" value={formulario.NUM_INT} onChange={handleChange} />
            </div>

            <div className="col-md-6">
              <label>Número Exterior:</label>
              <input type="text" className="form-control" name="NUM_EXT" value={formulario.NUM_EXT} onChange={handleChange} />
            </div>
          </div>

          <div className="mt-3 text-end">
            <button className="btn btn-secondary me-2" onClick={() => {
              limpiarFormulario();
              setMostrarFormulario(false);
            }}>
              Cancelar
            </button>
            <button className="btn btn-success" onClick={handleGuardar}>
              Guardar
            </button>
          </div>
        </div>
      )}

      {!mostrarFormulario && (
        <button
          className="btn btn-success rounded-circle position-fixed"
          style={{ bottom: '30px', right: '30px', width: '50px', height: '50px' }}
          onClick={() => {
            limpiarFormulario();
            setMostrarFormulario(true);
          }}
        >
          <i className="bi bi-plus-lg"></i>
        </button>
      )}
    </div>
  );
};

export default DireccionEmpleadosTable;
