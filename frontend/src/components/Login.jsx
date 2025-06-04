import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const manejarLogin = (e) => {
    e.preventDefault();
    if (usuario === 'admin' && contrasena === 'admin123') {
      localStorage.setItem('autenticado', 'true');
      navigate('/joyas');
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <form onSubmit={manejarLogin} className="bg-white p-4 rounded shadow" style={{ minWidth: '350px' }}>
        <h3 className="text-center mb-4">Iniciar Sesión 🔐</h3>
        <div className="mb-3">
          <label className="form-label">Usuario</label>
          <input type="text" className="form-control" value={usuario} onChange={e => setUsuario(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input type="password" className="form-control" value={contrasena} onChange={e => setContrasena(e.target.value)} />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary w-100">Entrar</button>
      </form>
    </div>
  );
};

export default Login;
