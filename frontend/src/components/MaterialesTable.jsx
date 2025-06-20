import React, { useEffect, useState } from "react";
import axios from "axios";

const MaterialesTable = () => {
  const [materiales, setMateriales] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [formulario, setFormulario] = useState({ NOMBRE: "" });
  const [editando, setEditando] = useState(null);

  const cargarMateriales = async () => {
    const res = await axios.get("http://localhost:3000/api/materiales");
    setMateriales(res.data);
  };

  useEffect(() => {
    cargarMateriales();
  }, []);

  const handleInputChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleAgregar = async () => {
    if (!formulario.NOMBRE.trim()) return;
    await axios.post("http://localhost:3000/api/materiales", formulario);
    setFormulario({ NOMBRE: "" });
    cargarMateriales();
  };

  const handleEditar = (mat) => {
    setEditando(mat.CLAVE);
    setFormulario({ NOMBRE: mat.NOMBRE });
  };

  const handleActualizar = async () => {
    if (!formulario.NOMBRE.trim()) return;
    await axios.put(`http://localhost:3000/api/materiales/${editando}`, formulario);
    setEditando(null);
    setFormulario({ NOMBRE: "" });
    cargarMateriales();
  };

  const handleEliminar = async (clave) => {
    if (!window.confirm("¿Estás seguro de eliminar este material?")) return;
    await axios.delete(`http://localhost:3000/api/materiales/${clave}`);
    cargarMateriales();
  };

  const materialesFiltrados = materiales.filter((m) =>
    m.NOMBRE.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Materiales</h2>

      <input
        type="text"
        placeholder="Buscar por nombre..."
        className="form-control mb-3"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <table className="table table-bordered table-hover text-center">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Clave</th>
            <th>Nombre</th>
            <th>Editar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {materialesFiltrados.map((mat, index) => (
            <tr key={mat.CLAVE}>
              <td>{index + 1}</td>
              <td>{mat.CLAVE}</td>
              <td>{mat.NOMBRE}</td>
              <td>
                <button className="btn btn-warning btn-sm" onClick={() => handleEditar(mat)}>
                  <i className="fas fa-edit"></i>
                </button>
              </td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(mat.CLAVE)}>
                  <i className="fas fa-trash-alt"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Formulario */}
      <div className="card p-3 mt-4">
        <h5>{editando ? "Editar material" : "Agregar material"}</h5>
        <div className="row">
          <div className="col-md-6">
            <input
              type="text"
              name="NOMBRE"
              placeholder="Nombre del material"
              className="form-control mb-2"
              value={formulario.NOMBRE}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-6">
            <button
              className="btn btn-success w-100"
              onClick={editando ? handleActualizar : handleAgregar}
            >
              {editando ? "Actualizar" : "Agregar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialesTable;
