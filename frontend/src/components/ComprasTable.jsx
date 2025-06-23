import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config";

const ComprasTable = () => {
  const [compras, setCompras] = useState([]);
  const [formulario, setFormulario] = useState({
    CLAVE_EMPLEADO: "",
    CLAVE_SUCURSAL: "",
    CLAVE_DISTRIBUIDOR: "",
    FECHA: "",
    TOTAL: ""
  });
  const [empleados, setEmpleados] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [distribuidores, setDistribuidores] = useState([]);
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    obtenerCompras();
    obtenerEmpleados();
    obtenerSucursales();
    obtenerDistribuidores();
  }, []);

  const obtenerCompras = async () => {
    const res = await axios.get(`${BASE_URL}/compras`);
    setCompras(res.data);
  };

  const obtenerEmpleados = async () => {
    const res = await axios.get(`${BASE_URL}/empleados`);
    setEmpleados(res.data);
  };

  const obtenerSucursales = async () => {
    const res = await axios.get(`${BASE_URL}/sucursales`);
    setSucursales(res.data);
  };

  const obtenerDistribuidores = async () => {
    const res = await axios.get(`${BASE_URL}/distribuidores`);
    setDistribuidores(res.data);
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const enviarFormulario = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await axios.put(`${BASE_URL}/compras/${editando}`, formulario);
      } else {
        await axios.post(`${BASE_URL}/compras`, formulario);
      }
      obtenerCompras();
      setFormulario({
        CLAVE_EMPLEADO: "",
        CLAVE_SUCURSAL: "",
        CLAVE_DISTRIBUIDOR: "",
        FECHA: "",
        TOTAL: ""
      });
      setEditando(null);
    } catch (err) {
      console.error("Error al guardar compra:", err);
    }
  };

  const editarCompra = (clave) => {
    const compra = compras.find((c) => c.CLAVE_COMPRA === clave);
    setFormulario({
      CLAVE_EMPLEADO: empleados.find((e) => `${e.NOMBRE} ${e.APELLIDO_PAT}` === compra.EMPLEADO)?.CLAVE || "",
      CLAVE_SUCURSAL: sucursales.find((s) => s.NOMBRE === compra.SUCURSAL)?.CLAVE || "",
      CLAVE_DISTRIBUIDOR: distribuidores.find((d) => d.NOMBRE === compra.DISTRIBUIDOR)?.CLAVE || "",
      FECHA: compra.FECHA,
      TOTAL: compra.TOTAL
    });
    setEditando(clave);
  };

  const eliminarCompra = async (clave) => {
    if (window.confirm("¿Estás seguro de eliminar esta compra?")) {
      await axios.delete(`${BASE_URL}/compras/${clave}`);
      obtenerCompras();
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Compras</h2>

      <form onSubmit={enviarFormulario} className="mb-4">
        <div className="row g-2">
          <div className="col-md-3">
            <select name="CLAVE_EMPLEADO" className="form-control" value={formulario.CLAVE_EMPLEADO} onChange={manejarCambio} required>
              <option value="">Empleado</option>
              {empleados.map((e) => (
                <option key={e.CLAVE} value={e.CLAVE}>
                  {e.NOMBRE} {e.APELLIDO_PAT}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <select name="CLAVE_SUCURSAL" className="form-control" value={formulario.CLAVE_SUCURSAL} onChange={manejarCambio} required>
              <option value="">Sucursal</option>
              {sucursales.map((s) => (
                <option key={s.CLAVE} value={s.CLAVE}>{s.NOMBRE}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <select name="CLAVE_DISTRIBUIDOR" className="form-control" value={formulario.CLAVE_DISTRIBUIDOR} onChange={manejarCambio} required>
              <option value="">Distribuidor</option>
              {distribuidores.map((d) => (
                <option key={d.CLAVE} value={d.CLAVE}>{d.NOMBRE}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <input type="date" name="FECHA" className="form-control" value={formulario.FECHA} onChange={manejarCambio} required />
          </div>
          <div className="col-md-1">
            <input type="number" name="TOTAL" className="form-control" placeholder="Total" value={formulario.TOTAL} onChange={manejarCambio} step="0.01" required />
          </div>
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          {editando ? "Actualizar" : "Agregar"}
        </button>
      </form>

      <table className="table table-hover table-bordered text-center">
        <thead className="table-dark">
          <tr>
            <th>Clave</th>
            <th>Fecha</th>
            <th>Empleado</th>
            <th>Sucursal</th>
            <th>Distribuidor</th>
            <th>Total</th>
            <th>Editar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {compras.map((c) => (
            <tr key={c.CLAVE_COMPRA}>
              <td>{c.CLAVE_COMPRA}</td>
              <td>{c.FECHA}</td>
              <td>{c.EMPLEADO}</td>
              <td>{c.SUCURSAL}</td>
              <td>{c.DISTRIBUIDOR}</td>
              <td>${c.TOTAL?.toFixed(2)}</td>
              <td>
                <button className="btn btn-warning btn-sm" onClick={() => editarCompra(c.CLAVE_COMPRA)}>
                  <i className="fas fa-edit" />
                </button>
              </td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => eliminarCompra(c.CLAVE_COMPRA)}>
                  <i className="fas fa-trash" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComprasTable;
