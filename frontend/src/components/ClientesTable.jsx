// src/components/ClientesTable.jsx
import React, { useState, useEffect } from 'react';
import { FaEye, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const ClientesTable = () => {
  const [clientes, setClientes] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: '', apellido_pat: '', apellido_mat: '',
    fecha_nac: '', fecha_reg: '', telefono: '',
    correo: '', foto: '', clave_direccion: ''
  });
  const [clienteEditando, setClienteEditando] = useState(null);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const [paginaActual, setPaginaActual] = useState(1);
  const clientesPorPagina = 10;
  const indexUltima = paginaActual * clientesPorPagina;
  const indexPrimera = indexUltima - clientesPorPagina;
  const clientesActuales = clientesFiltrados.slice(indexPrimera, indexUltima);
  const totalPaginas = Math.ceil(clientesFiltrados.length / clientesPorPagina);
  const cambiarPagina = (n) => { if (n >= 1 && n <= totalPaginas) setPaginaActual(n); };

  const mostrarToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type }), 3000);
  };

  const obtenerClientes = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/clientes');
      const data = await res.json();
      setClientes(data);
      setClientesFiltrados(data);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      mostrarToast('Error al cargar clientes', 'danger');
    }
  };

  useEffect(() => {
    obtenerClientes();
  }, []);

  const manejarCambio = e => {
    setNuevoCliente({ ...nuevoCliente, [e.target.name]: e.target.value });
  };

  const manejarBusqueda = e => {
    const texto = e.target.value.toLowerCase();
    setFiltro(texto);
    setPaginaActual(1);
    setClientesFiltrados(clientes.filter(c => c.NOMBRE.toLowerCase().includes(texto)));
  };

  const guardarCliente = async () => {
    const metodo = clienteEditando ? 'PUT' : 'POST';
    const url = clienteEditando
      ? `http://localhost:3000/api/clientes/${clienteEditando.CLAVE}`
      : 'http://localhost:3000/api/clientes';

    const res = await fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoCliente),
    });

    if (res.ok) {
      document.getElementById('cerrarModal').click();
      setNuevoCliente({
        nombre: '', apellido_pat: '', apellido_mat: '',
        fecha_nac: '', fecha_reg: '', telefono: '',
        correo: '', foto: '', clave_direccion: ''
      });
      setClienteEditando(null);
      obtenerClientes();
      mostrarToast(clienteEditando ? 'Cliente actualizado' : 'Cliente agregado');
    } else {
      mostrarToast('Error al guardar cliente', 'danger');
    }
  };

  const eliminarCliente = async (clave) => {
    if (window.confirm('¿Eliminar cliente?')) {
      const res = await fetch(`http://localhost:3000/api/clientes/${clave}`, { method: 'DELETE' });
      if (res.ok) {
        obtenerClientes();
        mostrarToast('Cliente eliminado');
      } else {
        mostrarToast('Error al eliminar cliente', 'danger');
      }
    }
  };

  const prepararEdicion = (cliente) => {
    setNuevoCliente({
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
    setClienteEditando(cliente);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Catálogo de Clientes 🧑‍💼</h2>

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
            <th>#</th><th>Nombre</th><th>Apellido</th><th>Teléfono</th><th>Correo</th>
            <th>Ver</th><th>Editar</th><th>Eliminar</th>
          </tr>
        </thead>
        <tbody className="text-center align-middle">
          {clientesActuales.map((cliente, index) => (
            <tr key={index}>
              <td>{indexPrimera + index + 1}</td>
              <td>{cliente.NOMBRE}</td>
              <td>{cliente.APELLIDO_PAT} {cliente.APELLIDO_MAT}</td>
              <td>{cliente.TELEFONO}</td>
              <td>{cliente.CORREO}</td>
              <td><button className="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#modalVer" onClick={() => setClienteSeleccionado(cliente)}><FaEye /></button></td>
              <td><button className="btn btn-outline-warning" onClick={() => prepararEdicion(cliente)} data-bs-toggle="modal" data-bs-target="#modalAgregar"><FaEdit /></button></td>
              <td><button className="btn btn-outline-danger" onClick={() => eliminarCliente(cliente.CLAVE)}><FaTrash /></button></td>
            </tr>
          ))}
        </tbody>
      </table>

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
          setClienteEditando(null);
          setNuevoCliente({
            nombre: '', apellido_pat: '', apellido_mat: '',
            fecha_nac: '', fecha_reg: '', telefono: '',
            correo: '', foto: '', clave_direccion: ''
          });
        }}>
        <FaPlus size={20} />
      </button>

      {/* Modal Agregar/Editar */}
      <div className="modal fade" id="modalAgregar" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{clienteEditando ? 'Editar Cliente' : 'Agregar Cliente'}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" id="cerrarModal"></button>
            </div>
            <div className="modal-body">
              <input name="nombre" placeholder="Nombre" className="form-control mb-2" value={nuevoCliente.nombre} onChange={manejarCambio} />
              <input name="apellido_pat" placeholder="Apellido Paterno" className="form-control mb-2" value={nuevoCliente.apellido_pat} onChange={manejarCambio} />
              <input name="apellido_mat" placeholder="Apellido Materno" className="form-control mb-2" value={nuevoCliente.apellido_mat} onChange={manejarCambio} />
              <input name="fecha_nac" type="date" className="form-control mb-2" value={nuevoCliente.fecha_nac} onChange={manejarCambio} />
              <input name="fecha_reg" type="date" className="form-control mb-2" value={nuevoCliente.fecha_reg} onChange={manejarCambio} />
              <input name="telefono" placeholder="Teléfono" className="form-control mb-2" value={nuevoCliente.telefono} onChange={manejarCambio} />
              <input name="correo" placeholder="Correo" className="form-control mb-2" value={nuevoCliente.correo} onChange={manejarCambio} />
              <input name="foto" placeholder="URL de foto" className="form-control mb-2" value={nuevoCliente.foto} onChange={manejarCambio} />
              <input name="clave_direccion" placeholder="Clave Dirección" className="form-control mb-2" value={nuevoCliente.clave_direccion} onChange={manejarCambio} />
            </div>
            <div className="modal-footer">
              <button className="btn btn-success" onClick={guardarCliente}>{clienteEditando ? 'Actualizar' : 'Guardar'}</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Ver */}
      <div className="modal fade" id="modalVer" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Detalles del Cliente</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              {clienteSeleccionado && (
                <div>
                  <strong>Nombre:</strong> {clienteSeleccionado.NOMBRE} {clienteSeleccionado.APELLIDO_PAT} {clienteSeleccionado.APELLIDO_MAT}<br />
                  <strong>Fecha Nacimiento:</strong> {clienteSeleccionado.FECHA_NAC}<br />
                  <strong>Fecha Registro:</strong> {clienteSeleccionado.FECHA_REG}<br />
                  <strong>Teléfono:</strong> {clienteSeleccionado.TELEFONO}<br />
                  <strong>Correo:</strong> {clienteSeleccionado.CORREO}<br />
                  <img src={clienteSeleccionado.FOTO} alt="foto" className="img-fluid mt-3" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientesTable;
