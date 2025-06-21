import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const DetalleVentaTable = () => {
  const [detalles, setDetalles] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [joyas, setJoyas] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 10;

  const [detalleEditando, setDetalleEditando] = useState(null);
  const [nuevaCantidad, setNuevaCantidad] = useState("");

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevoDetalle, setNuevoDetalle] = useState({
    CLAVE_VENTA: "",
    CLAVE_JOYA: "",
    CANTIDAD: ""
  });

  useEffect(() => {
    obtenerDetalles();
    obtenerVentas();
    obtenerJoyas();
  }, []);

  const obtenerDetalles = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/detalleventa");
      setDetalles(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error al obtener detalles:", error);
    }
  };

  const obtenerVentas = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/ventas");
      setVentas(res.data || []);
    } catch (error) {
      console.error("Error al obtener ventas:", error);
    }
  };

  const obtenerJoyas = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/joyas");
      setJoyas(res.data || []);
    } catch (error) {
      console.error("Error al obtener joyas:", error);
    }
  };

  const detallesFiltrados = detalles.filter((detalle) => {
    const cliente = detalle.CLIENTE?.toLowerCase() || "";
    const sucursal = detalle.SUCURSAL?.toLowerCase() || "";
    return (
      cliente.includes(filtro.toLowerCase()) ||
      sucursal.includes(filtro.toLowerCase())
    );
  });

  const totalPaginas = Math.ceil(detallesFiltrados.length / elementosPorPagina);
  const indiceInicial = (paginaActual - 1) * elementosPorPagina;
  const detallesPaginados = detallesFiltrados.slice(
    indiceInicial,
    indiceInicial + elementosPorPagina
  );

  const cambiarPagina = (pagina) => {
    if (pagina >= 1 && pagina <= totalPaginas) setPaginaActual(pagina);
  };

  const handleEditarClick = (detalle) => {
    setDetalleEditando(detalle);
    setNuevaCantidad(detalle.CANTIDAD);
  };

  const handleCancelarEdicion = () => {
    setDetalleEditando(null);
    setNuevaCantidad("");
  };

  const handleActualizar = async () => {
    if (!detalleEditando) return;
    try {
      await axios.put(
        `http://localhost:3000/api/detalleventa/${detalleEditando.CLAVE_VENTA}/${detalleEditando.CLAVE_JOYA}`,
        { CANTIDAD: nuevaCantidad }
      );
      await obtenerDetalles();
      setDetalleEditando(null);
    } catch (error) {
      console.error("Error al actualizar detalle:", error);
    }
  };

  const handleEliminar = async (claveVenta, claveJoya) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/detalleventa/${claveVenta}/${claveJoya}`
      );
      await obtenerDetalles();
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const handleAgregarDetalle = async () => {
    try {
      await axios.post("http://localhost:3000/api/detalleventa", nuevoDetalle);
      await obtenerDetalles();
      setMostrarFormulario(false);
      setNuevoDetalle({ CLAVE_VENTA: "", CLAVE_JOYA: "", CANTIDAD: "" });
    } catch (error) {
      console.error("Error al agregar detalle:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Detalles de Venta</h2>
      <input
        type="text"
        placeholder="Buscar por cliente o sucursal"
        className="form-control my-3"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />

      <table className="table table-bordered table-striped text-center">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Cliente</th>
            <th>Empleado</th>
            <th>Sucursal</th>
            <th>Fecha</th>
            <th>Joya</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {detallesPaginados.map((detalle, index) => (
            <tr key={`${detalle.CLAVE_VENTA}-${detalle.CLAVE_JOYA}`}>
              <td>{indiceInicial + index + 1}</td>
              <td>{detalle.CLIENTE || "—"}</td>
              <td>{detalle.EMPLEADO || "—"}</td>
              <td>{detalle.SUCURSAL || "—"}</td>
              <td>
                {detalle.FECHA
                  ? new Date(detalle.FECHA).toLocaleDateString("es-MX")
                  : "—"}
              </td>
              <td>{detalle.JOYA}</td>
              <td>{detalle.CANTIDAD}</td>
              <td>{`$${Number(detalle.PRECIO_UNITARIO).toFixed(2)}`}</td>
              <td>{`$${Number(detalle.TOTAL).toFixed(2)}`}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEditarClick(detalle)}
                >
                  <FaEdit />
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() =>
                    handleEliminar(detalle.CLAVE_VENTA, detalle.CLAVE_JOYA)
                  }
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <div className="d-flex justify-content-center my-3">
        <nav>
          <ul className="pagination">
            {Array.from({ length: totalPaginas }, (_, i) => (
              <li
                key={i + 1}
                className={`page-item ${paginaActual === i + 1 ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => cambiarPagina(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Formulario editar */}
      {detalleEditando && (
        <div className="card card-body mt-4">
          <h5>Editar Cantidad</h5>
          <p>
            Cliente: <strong>{detalleEditando.CLIENTE}</strong><br />
            Joya: <strong>{detalleEditando.JOYA}</strong>
          </p>
          <input
            type="number"
            className="form-control"
            value={nuevaCantidad}
            onChange={(e) => setNuevaCantidad(e.target.value)}
          />
          <div className="d-flex justify-content-end mt-3">
            <button className="btn btn-secondary me-2" onClick={handleCancelarEdicion}>
              Cancelar
            </button>
            <button className="btn btn-success" onClick={handleActualizar}>
              Actualizar
            </button>
          </div>
        </div>
      )}

      {/* Formulario agregar */}
      {mostrarFormulario && (
        <div className="card card-body mt-4">
          <h5>Agregar nuevo detalle</h5>
          <select
            className="form-control mb-2"
            value={nuevoDetalle.CLAVE_VENTA}
            onChange={(e) =>
              setNuevoDetalle({ ...nuevoDetalle, CLAVE_VENTA: e.target.value })
            }
          >
            <option value="">Selecciona una venta</option>
            {ventas.map((venta) => (
              <option key={venta.CLAVE} value={venta.CLAVE}>
                {venta.CLAVE} - {venta.CLIENTE}
              </option>
            ))}
          </select>

          <select
            className="form-control mb-2"
            value={nuevoDetalle.CLAVE_JOYA}
            onChange={(e) =>
              setNuevoDetalle({ ...nuevoDetalle, CLAVE_JOYA: e.target.value })
            }
          >
            <option value="">Selecciona una joya</option>
            {joyas.map((joya) => (
              <option key={joya.CLAVE} value={joya.CLAVE}>
                {joya.NOMBRE}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Cantidad"
            className="form-control mb-2"
            value={nuevoDetalle.CANTIDAD}
            onChange={(e) =>
              setNuevoDetalle({ ...nuevoDetalle, CANTIDAD: e.target.value })
            }
          />
          <div className="d-flex justify-content-end">
            <button
              className="btn btn-secondary me-2"
              onClick={() => setMostrarFormulario(false)}
            >
              Cancelar
            </button>
            <button className="btn btn-success" onClick={handleAgregarDetalle}>
              Guardar
            </button>
          </div>
        </div>
      )}

      {/* Botón flotante */}
      <button
        className="btn btn-success rounded-circle position-fixed"
        style={{ bottom: "20px", right: "20px" }}
        onClick={() => setMostrarFormulario(true)}
      >
        <FaPlus />
      </button>
    </div>
  );
};

export default DetalleVentaTable;
