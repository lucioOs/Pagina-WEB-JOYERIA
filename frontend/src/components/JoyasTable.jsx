// src/components/JoyasTable.jsx
import React, { useState, useEffect } from 'react';
import { FaEye, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const JoyasTable = () => {
  const [joyas, setJoyas] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [joyasFiltradas, setJoyasFiltradas] = useState([]);
  const [nuevaJoya, setNuevaJoya] = useState({
    nombre: '', descripcion: '', precio: '', inventario: '', tipo: '', material: ''
  });
  const [joyaEditando, setJoyaEditando] = useState(null);
  const [joyaSeleccionada, setJoyaSeleccionada] = useState(null);
  const [tipos, setTipos] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // 🔢 Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const joyasPorPagina = 10;
  const indexUltima = paginaActual * joyasPorPagina;
  const indexPrimera = indexUltima - joyasPorPagina;
  const joyasActuales = joyasFiltradas.slice(indexPrimera, indexUltima);
  const totalPaginas = Math.ceil(joyasFiltradas.length / joyasPorPagina);
  const cambiarPagina = (n) => { if (n >= 1 && n <= totalPaginas) setPaginaActual(n); };

  const mostrarToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type }), 3000);
  };

  const obtenerJoyas = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/joyas');
      const data = await res.json();
      setJoyas(data);
      setJoyasFiltradas(data);
    } catch (error) {
      console.error('Error al cargar joyas:', error);
      mostrarToast('Error al cargar joyas', 'danger');
    }
  };

  const obtenerTiposYMateriales = async () => {
    const resTipos = await fetch('http://localhost:3000/api/joyas/tipos');
    const resMateriales = await fetch('http://localhost:3000/api/joyas/materiales');
    setTipos(await resTipos.json());
    setMateriales(await resMateriales.json());
  };

  useEffect(() => {
    obtenerJoyas();
    obtenerTiposYMateriales();
  }, []);

  const manejarCambio = e => {
    setNuevaJoya({ ...nuevaJoya, [e.target.name]: e.target.value });
  };

  const manejarBusqueda = e => {
    const texto = e.target.value.toLowerCase();
    setFiltro(texto);
    setPaginaActual(1);
    setJoyasFiltradas(joyas.filter(j => j.NOMBRE.toLowerCase().includes(texto)));
  };

  const agregarJoya = async () => {
    const metodo = joyaEditando ? 'PUT' : 'POST';
    const url = joyaEditando
      ? `http://localhost:3000/api/joyas/${joyaEditando.CLAVE}`
      : 'http://localhost:3000/api/joyas';

    const res = await fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevaJoya),
    });

    if (res.ok) {
      document.getElementById('cerrarModal').click();
      setNuevaJoya({ nombre: '', descripcion: '', precio: '', inventario: '', tipo: '', material: '' });
      setJoyaEditando(null);
      obtenerJoyas();
      mostrarToast(joyaEditando ? 'Joya actualizada' : 'Joya agregada');
    } else {
      mostrarToast('Error al guardar la joya', 'danger');
    }
  };

  const eliminarJoya = async (clave) => {
    if (window.confirm('¿Seguro que deseas eliminar esta joya?')) {
      const res = await fetch(`http://localhost:3000/api/joyas/${clave}`, { method: 'DELETE' });
      if (res.ok) {
        obtenerJoyas();
        mostrarToast('Joya eliminada', 'success');
      } else {
        mostrarToast('Error al eliminar la joya', 'danger');
      }
    }
  };

  const prepararEdicion = (joya) => {
    setNuevaJoya({
      nombre: joya.NOMBRE,
      descripcion: joya.DESCRIPCION,
      precio: joya.PRECIO,
      inventario: joya.INVENTARIO,
      tipo: joya.TIPO,
      material: joya.MATERIAL
    });
    setJoyaEditando(joya);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Catálogo de Joyas </h2>

      {toast.show && (
        <div className={`alert alert-${toast.type} position-fixed top-0 end-0 m-3`}>{toast.message}</div>
      )}

      <input
        type="text"
        placeholder="Buscar por nombre..."
        className="form-control mb-3"
        value={filtro}
        onChange={manejarBusqueda}
      />

      <table className="table table-bordered table-hover shadow">
        <thead className="table-dark text-center">
          <tr>
            <th>#</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Cantidad</th><th>Total</th><th>Imagen</th>
            <th>Ver</th><th>Editar</th><th>Eliminar</th>
          </tr>
        </thead>
        <tbody className="text-center align-middle">
          {joyasActuales.map((joya, index) => (
            <tr key={index}>
              <td>{indexPrimera + index + 1}</td>
              <td>{joya.NOMBRE}</td>
              <td>{joya.TIPO}</td>
              <td>${joya.PRECIO}</td>
              <td>{joya.INVENTARIO}</td>
              <td>${joya.PRECIO * joya.INVENTARIO}</td>
              <td><img src={joya.FOTO} alt={joya.NOMBRE} width="90" /></td>
              <td><button className="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#modalVer" onClick={() => setJoyaSeleccionada(joya)}><FaEye /></button></td>
              <td><button className="btn btn-outline-warning" onClick={() => prepararEdicion(joya)} data-bs-toggle="modal" data-bs-target="#modalAgregar"><FaEdit /></button></td>
              <td><button className="btn btn-outline-danger" onClick={() => eliminarJoya(joya.CLAVE)}><FaTrash /></button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <div className="d-flex justify-content-center mt-3">
        <button className="btn btn-secondary mx-1" onClick={() => cambiarPagina(paginaActual - 1)} disabled={paginaActual === 1}>◀</button>
        {[...Array(totalPaginas)].map((_, i) => (
          <button
            key={i}
            className={`btn btn-${paginaActual === i + 1 ? 'dark' : 'light'} mx-1`}
            onClick={() => cambiarPagina(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button className="btn btn-secondary mx-1" onClick={() => cambiarPagina(paginaActual + 1)} disabled={paginaActual === totalPaginas}>▶</button>
      </div>

      <button className="btn btn-danger rounded-circle position-fixed bottom-0 end-0 m-5 shadow-lg"
        data-bs-toggle="modal" data-bs-target="#modalAgregar" onClick={() => {
          setJoyaEditando(null);
          setNuevaJoya({ nombre: '', descripcion: '', precio: '', inventario: '', tipo: '', material: '' });
        }}>
        <FaPlus size={20} />
      </button>

      {/* Modal Agregar/Editar */}
      <div className="modal fade" id="modalAgregar" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{joyaEditando ? 'Editar Joya' : 'Agregar nueva joya'}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" id="cerrarModal"></button>
            </div>
            <div className="modal-body">
              <label>Nombre</label>
              <input name="nombre" onChange={manejarCambio} value={nuevaJoya.nombre} className="form-control mb-2" />
              <label>Descripción</label>
              <input name="descripcion" onChange={manejarCambio} value={nuevaJoya.descripcion} className="form-control mb-2" />
              <label>Precio</label>
              <input name="precio" type="number" onChange={manejarCambio} value={nuevaJoya.precio} className="form-control mb-2" />
              <label>Inventario</label>
              <input name="inventario" type="number" onChange={manejarCambio} value={nuevaJoya.inventario} className="form-control mb-2" />
              <label>Tipo</label>
              <select name="tipo" onChange={manejarCambio} value={nuevaJoya.tipo} className="form-control mb-2">
                <option value="">Seleccione un tipo</option>
                {tipos.map(t => <option key={t.CLAVE} value={t.CLAVE}>{t.NOMBRE}</option>)}
              </select>
              <label>Material</label>
              <select name="material" onChange={manejarCambio} value={nuevaJoya.material} className="form-control mb-2">
                <option value="">Seleccione un material</option>
                {materiales.map(m => <option key={m.CLAVE} value={m.CLAVE}>{m.NOMBRE}</option>)}
              </select>
            </div>
            <div className="modal-footer">
              <button className="btn btn-success" onClick={agregarJoya}>{joyaEditando ? 'Actualizar' : 'Guardar'}</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Ver */}
      <div className="modal fade" id="modalVer" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Detalles de la Joya</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              {joyaSeleccionada && (
                <div>
                  <strong>Nombre:</strong> {joyaSeleccionada.NOMBRE}<br />
                  <strong>Descripción:</strong> {joyaSeleccionada.DESCRIPCION}<br />
                  <strong>Precio:</strong> ${joyaSeleccionada.PRECIO}<br />
                  <strong>Inventario:</strong> {joyaSeleccionada.INVENTARIO}<br />
                  <strong>Tipo:</strong> {joyaSeleccionada.TIPO}<br />
                  <strong>Material:</strong> {joyaSeleccionada.MATERIAL}<br />
                  <img src={joyaSeleccionada.FOTO} alt={joyaSeleccionada.NOMBRE} className="img-fluid mt-3" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoyasTable;
