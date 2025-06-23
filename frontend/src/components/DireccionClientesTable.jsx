// IMPORTS
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';

const DireccionClientesTable = () => {
  const [direcciones, setDirecciones] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [estados, setEstados] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [formulario, setFormulario] = useState({
    ESTADO: '', MUNICIPIO: '', CP: '', COLONIA: '', CALLE: '',
    NUM_INT: '', NUM_EXT: '', CLIENTE_CLAVE: ''
  });
  const [editando, setEditando] = useState(false);
  const [claveEditando, setClaveEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [paginaActual, setPaginaActual] = useState(1);
  const direccionesPorPagina = 5;

  useEffect(() => {
    obtenerDirecciones();
    obtenerClientes();
    obtenerEstados();
  }, []);

  const obtenerDirecciones = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/direccionclientes`);
      setDirecciones(res.data);
    } catch (err) {
      console.error('Error al obtener direcciones', err);
    }
  };

  const obtenerClientes = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/clientes`);
      setClientes(res.data);
    } catch (err) {
      console.error('Error al obtener clientes', err);
    }
  };

  const obtenerEstados = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/estados`);
      setEstados(res.data);
    } catch (err) {
      console.error('Error al obtener estados', err);
    }
  };

  const handleChange = e => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const limpiarFormulario = () => {
    setFormulario({
      ESTADO: '', MUNICIPIO: '', CP: '', COLONIA: '', CALLE: '',
      NUM_INT: '', NUM_EXT: '', CLIENTE_CLAVE: ''
    });
    setEditando(false);
    setClaveEditando(null);
  };

  const handleGuardar = async () => {
    try {
      if (editando) {
        await axios.put(`${BASE_URL}/direccionclientes/${claveEditando}`, formulario);
      } else {
        await axios.post(`${BASE_URL}/direccionclientes`, formulario);
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
    try {
      await axios.delete(`${BASE_URL}/direccionclientes/${clave}`);
      obtenerDirecciones();
    } catch (err) {
      console.error('Error al eliminar dirección', err);
    }
  };

  const direFiltradas = direcciones.filter(d =>
    d.NOMBRE_CLIENTE?.toLowerCase().includes(busqueda.toLowerCase()) ||
    d.COLONIA?.toLowerCase().includes(busqueda.toLowerCase()) ||
    d.CALLE?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const totalPaginas = Math.ceil(direFiltradas.length / direccionesPorPagina);
  const direccionesVisibles = direFiltradas.slice(
    (paginaActual - 1) * direccionesPorPagina,
    paginaActual * direccionesPorPagina
  );

  return (
    <div className="container mt-4">
      <h2 className="text-center">Direcciones de Clientes</h2>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Buscar por cliente, calle o colonia"
        value={busqueda}
        onChange={e => {
          setBusqueda(e.target.value);
          setPaginaActual(1);
        }}
      />

      <table className="table table-hover table-bordered align-middle">
        <thead className="table-dark text-center">
          <tr>
            <th>#</th>
            <th>Cliente</th>
            <th>Estado</th>
            <th>CP</th>
            <th>Colonia</th>
            <th>Calle</th>
            <th>Int</th>
            <th>Ext</th>
            <th>Editar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {direccionesVisibles.map((d, idx) => (
            <tr key={d.CLAVE} className="text-center">
              <td>{(paginaActual - 1) * direccionesPorPagina + idx + 1}</td>
              <td>{d.NOMBRE_CLIENTE}</td>
              <td>{d.NOMBRE_ESTADO}</td>
              <td>{d.CP}</td>
              <td>{d.COLONIA}</td>
              <td>{d.CALLE}</td>
              <td>{d.NUM_INT}</td>
              <td>{d.NUM_EXT}</td>
              <td>
                <button className="btn btn-warning d-flex justify-content-center align-items-center mx-auto"
                        style={{ width: '35px', height: '35px' }}
                        onClick={() => handleEditar(d)}>
                  <i className="bi bi-pencil-fill"></i>
                </button>
              </td>
              <td>
                <button className="btn btn-danger d-flex justify-content-center align-items-center mx-auto"
                        style={{ width: '35px', height: '35px' }}
                        onClick={() => handleEliminar(d.CLAVE)}>
                  <i className="bi bi-trash-fill"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-center">
        <ul className="pagination">
          {[...Array(totalPaginas)].map((_, i) => (
            <li key={i} className={`page-item ${paginaActual === i + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => setPaginaActual(i + 1)}>{i + 1}</button>
            </li>
          ))}
        </ul>
      </div>

      {mostrarFormulario && (
        <div className="mt-4 border rounded p-3 shadow-sm">
          <h5>{editando ? 'Editar Dirección' : 'Agregar Dirección'}</h5>
          <div className="row g-2">
            <div className="col-md-6">
              <label>Cliente:</label>
              <select className="form-select" name="CLIENTE_CLAVE" value={formulario.CLIENTE_CLAVE} onChange={handleChange}>
                <option value="">Selecciona un cliente</option>
                {clientes.map(c => (
                  <option key={c.CLAVE} value={c.CLAVE}>
                    {c.NOMBRE} {c.APELLIDO_PAT}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label>Estado:</label>
              <select className="form-select" name="ESTADO" value={formulario.ESTADO} onChange={handleChange}>
                <option value="">Selecciona un estado</option>
                {estados.map(e => (
                  <option key={e.CLAVE} value={e.CLAVE}>{e.NOMBRE}</option>
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
          className="btn btn-success rounded-circle position-fixed d-flex justify-content-center align-items-center"
          style={{ bottom: '30px', right: '30px', width: '50px', height: '50px' }}
          onClick={() => {
            limpiarFormulario();
            setMostrarFormulario(true);
          }}
        >
          <i className="bi bi-plus-lg fs-4"></i>
        </button>
      )}
    </div>
  );
};

export default DireccionClientesTable;
