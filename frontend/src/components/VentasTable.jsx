// src/components/VentasTable.jsx
import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';

const VentasTable = () => {
  const [ventas, setVentas] = useState([]);
  const [form, setForm] = useState({});
  const [editando, setEditando] = useState(false);
  const [claveEditando, setClaveEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const porPagina = 10;

  const URL = 'http://localhost:3000/api/ventas';

  useEffect(() => {
    obtenerVentas();
    fetch('http://localhost:3000/api/clientes').then(res => res.json()).then(setClientes);
    fetch('http://localhost:3000/api/empleados').then(res => res.json()).then(setEmpleados);
    fetch('http://localhost:3000/api/sucursales').then(res => res.json()).then(setSucursales);
  }, []);

  const obtenerVentas = async () => {
    const res = await fetch(URL);
    const data = await res.json();
    setVentas(data);
  };

  const generarClave = () => {
    const claves = ventas.map(v => parseInt(v.CLAVE.replace('V', ''))).filter(n => !isNaN(n));
    const siguiente = Math.max(...claves, 0) + 1;
    return 'V' + String(siguiente).padStart(3, '0');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const metodo = editando ? 'PUT' : 'POST';
    const endpoint = editando ? `${URL}/${claveEditando}` : URL;
    const payload = editando ? form : { ...form, CLAVE: generarClave() };

    const res = await fetch(endpoint, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      obtenerVentas();
      setForm({});
      setMostrarFormulario(false);
      setEditando(false);
    } else {
      Swal.fire('Error', 'No se pudo guardar la venta', 'error');
    }
  };

  const handleEditar = (venta) => {
    const cliente = clientes.find(c => `${c.NOMBRE} ${c.APELLIDO_PAT}` === venta.CLIENTE);
    const empleado = empleados.find(e => `${e.NOMBRE} ${e.APELLIDO_PAT}` === venta.EMPLEADO);
    const sucursal = sucursales.find(s => s.NOMBRE === venta.SUCURSAL);
    setForm({
      FECHA: venta.FECHA.split('T')[0],
      CLAVE_CLIENTE: cliente?.CLAVE || '',
      CLAVE_EMPLEADO: empleado?.CLAVE || '',
      CLAVE_SUCURSAL: sucursal?.CLAVE || ''
    });
    setClaveEditando(venta.CLAVE);
    setEditando(true);
    setMostrarFormulario(true);
  };

  const handleEliminar = async (clave) => {
    const confirm = await Swal.fire({
      title: '¿Eliminar venta?',
      text: "No podrás deshacer esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar'
    });

    if (confirm.isConfirmed) {
      const res = await fetch(`${URL}/${clave}`, { method: 'DELETE' });
      if (res.ok) {
        obtenerVentas();
        Swal.fire('Eliminado', 'La venta ha sido eliminada', 'success');
      }
    }
  };

  const filtrar = ventas.filter(v =>
    v.CLIENTE?.toLowerCase().includes(busqueda.toLowerCase()) ||
    v.EMPLEADO?.toLowerCase().includes(busqueda.toLowerCase()) ||
    v.SUCURSAL?.toLowerCase().includes(busqueda.toLowerCase()) ||
    v.CLAVE?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const totalPaginas = Math.ceil(filtrar.length / porPagina);
  const ventasPagina = filtrar.slice((paginaActual - 1) * porPagina, paginaActual * porPagina);

  return (
    <div className="container position-relative">
      <h2 className="text-center my-4">Catálogo de Ventas</h2>
      <input
        type="text"
        placeholder="Buscar por cliente, empleado o sucursal..."
        className="form-control mb-3"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <table className="table table-bordered text-center">
        <thead className="table-dark">
          <tr>
            <th>#</th><th>CLAVE</th><th>FECHA</th><th>CLIENTE</th><th>EMPLEADO</th><th>SUCURSAL</th>
            <th>Editar</th><th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {ventasPagina.map((v, i) => (
            <tr key={v.CLAVE}>
              <td>{(paginaActual - 1) * porPagina + i + 1}</td>
              <td>{v.CLAVE}</td>
              <td>{new Date(v.FECHA).toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
              <td>{v.CLIENTE}</td>
              <td>{v.EMPLEADO}</td>
              <td>{v.SUCURSAL}</td>
              <td><button className="btn btn-warning" onClick={() => handleEditar(v)}><FaEdit /></button></td>
              <td><button className="btn btn-danger" onClick={() => handleEliminar(v.CLAVE)}><FaTrash /></button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación mejorada */}
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
        title="Agregar nueva venta"
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
              <h5>{editando ? 'Editar venta' : 'Agregar nueva venta'}</h5>
              <button onClick={() => setMostrarFormulario(false)} className="btn"><FaTimes /></button>
            </div>
            <form className="row g-2" onSubmit={handleSubmit}>
              <div className="col-md-6">
                <input type="date" name="FECHA" value={form.FECHA || ''} onChange={handleChange} className="form-control" required />
              </div>
              <div className="col-md-6">
                <select name="CLAVE_CLIENTE" value={form.CLAVE_CLIENTE || ''} onChange={handleChange} className="form-select" required>
                  <option value="">Seleccionar Cliente</option>
                  {clientes.map(c => (
                    <option key={c.CLAVE} value={c.CLAVE}>{c.NOMBRE} {c.APELLIDO_PAT}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <select name="CLAVE_EMPLEADO" value={form.CLAVE_EMPLEADO || ''} onChange={handleChange} className="form-select" required>
                  <option value="">Seleccionar Empleado</option>
                  {empleados.map(e => (
                    <option key={e.CLAVE} value={e.CLAVE}>{e.NOMBRE} {e.APELLIDO_PAT}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <select name="CLAVE_SUCURSAL" value={form.CLAVE_SUCURSAL || ''} onChange={handleChange} className="form-select" required>
                  <option value="">Seleccionar Sucursal</option>
                  {sucursales.map(s => (
                    <option key={s.CLAVE} value={s.CLAVE}>{s.NOMBRE}</option>
                  ))}
                </select>
              </div>
              <div className="col-12 d-grid mt-2">
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={!form.FECHA || !form.CLAVE_CLIENTE || !form.CLAVE_EMPLEADO || !form.CLAVE_SUCURSAL}
                >
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

export default VentasTable;
