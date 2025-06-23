import React, { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import { BASE_URL } from '../config'; // ← aquí se importa

const PromocionesTable = () => {
  const [promociones, setPromociones] = useState([]);
  const [form, setForm] = useState({});
  const [editando, setEditando] = useState(false);
  const [claveEditando, setClaveEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [cargando, setCargando] = useState(false);
  const porPagina = 10;

  const URL = `${BASE_URL}/promociones`; // ← aquí se usa

  // ... (el resto del código sigue igual)



  useEffect(() => {
    obtenerPromociones();
  }, []);

  useEffect(() => {
    setPaginaActual(1); // Reiniciar paginación al buscar
  }, [busqueda]);

  const obtenerPromociones = async () => {
    try {
      const res = await fetch(URL);
      const data = await res.json();
      if (Array.isArray(data)) {
        setPromociones(data);
      } else {
        console.error('La respuesta no es un arreglo:', data);
        setPromociones([]);
      }
    } catch (error) {
      console.error('Error al obtener promociones:', error);
      setPromociones([]);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación previa
    if (
      !form.fecha ||
      isNaN(form.descuento) ||
      Number(form.descuento) < 0 ||
      Number(form.descuento) > 100
    ) {
      alert('❌ Ingresa una fecha válida y un descuento entre 0 y 100.');
      return;
    }

    setCargando(true);

    const datos = {
      fecha: form.fecha,
      descuento: Number(form.descuento),
    };

    const metodo = editando ? 'PUT' : 'POST';
    const endpoint = editando ? `${URL}/${claveEditando}` : URL;

    try {
      const res = await fetch(endpoint, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Error al guardar');
      }

      await obtenerPromociones();
      setForm({});
      setMostrarFormulario(false);
      setEditando(false);
    } catch (err) {
      alert(`❌ ${err.message}`);
    } finally {
      setCargando(false);
    }
  };

  const handleEditar = (p) => {
    setForm({ fecha: p.FECHA, descuento: p.DESCUENTO });
    setClaveEditando(p.CLAVE);
    setEditando(true);
    setMostrarFormulario(true);
  };

  const handleEliminar = async (clave) => {
    if (!window.confirm('¿Eliminar esta promoción?')) return;
    try {
      const res = await fetch(`${URL}/${clave}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await res.text());
      await obtenerPromociones();
    } catch (err) {
      alert(`❌ ${err.message}`);
    }
  };

  const filtrar = promociones.filter((p) =>
    (p.FECHA || '').includes(busqueda) ||
    String(p.DESCUENTO || '').includes(busqueda)
  );

  const totalPaginas = Math.ceil(filtrar.length / porPagina);
  const promocionesPagina = filtrar.slice(
    (paginaActual - 1) * porPagina,
    paginaActual * porPagina
  );

  const handlePaginaAnterior = () => {
    if (paginaActual > 1) setPaginaActual(paginaActual - 1);
  };

  const handlePaginaSiguiente = () => {
    if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
  };

  return (
    <div className="container position-relative">
      <h2 className="text-center my-4">Promociones Activas</h2>

      <input
        className="form-control mb-3"
        placeholder="Buscar por fecha o descuento..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <table className="table table-hover table-bordered text-center align-middle">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Fecha</th>
            <th>Descuento (%)</th>
            <th>Editar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {promocionesPagina.map((p, i) => (
            <tr key={p.CLAVE}>
              <td>{(paginaActual - 1) * porPagina + i + 1}</td>
              <td>{p.FECHA}</td>
              <td>{p.DESCUENTO}%</td>
              <td>
                <button className="btn btn-warning" onClick={() => handleEditar(p)}>
                  <FaEdit />
                </button>
              </td>
              <td>
                <button className="btn btn-danger" onClick={() => handleEliminar(p.CLAVE)}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="pagination justify-content-center">
        <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => setPaginaActual(1)}>⏮</button>
        </li>
        <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={handlePaginaAnterior}>◀</button>
        </li>
        {[...Array(totalPaginas)].map((_, i) => (
          <li key={i + 1} className={`page-item ${paginaActual === i + 1 ? 'active' : ''}`}>
            <button className="page-link" onClick={() => setPaginaActual(i + 1)}>{i + 1}</button>
          </li>
        ))}
        <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
          <button className="page-link" onClick={handlePaginaSiguiente}>▶</button>
        </li>
        <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => setPaginaActual(totalPaginas)}>⏭</button>
        </li>
      </ul>

      <button
        className="btn btn-success rounded-circle position-fixed shadow"
        style={{ bottom: 40, right: 40 }}
        onClick={() => {
          setForm({});
          setEditando(false);
          setMostrarFormulario(true);
        }}
        title="Agregar nueva promoción"
      >
        <FaPlus />
      </button>

      {mostrarFormulario && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="d-flex justify-content-between mb-2">
              <h5>{editando ? 'Editar promoción' : 'Agregar nueva promoción'}</h5>
              <button onClick={() => setMostrarFormulario(false)} className="btn"><FaTimes /></button>
            </div>
            <form className="row g-2" onSubmit={handleSubmit}>
              <div className="col-md-6">
                <label className="form-label">Fecha</label>
                <input
                  type="date"
                  name="fecha"
                  value={form.fecha || ''}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Descuento (%)</label>
                <input
                  type="number"
                  name="descuento"
                  value={form.descuento || ''}
                  onChange={handleChange}
                  className="form-control"
                  required
                  min={0}
                  max={100}
                />
              </div>
              <div className="col-12 d-grid mt-2">
                <button type="submit" className="btn btn-success" disabled={cargando}>
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

export default PromocionesTable;
