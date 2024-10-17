import React, { useState } from 'react';
import axios from 'axios';
import qs from 'qs';
import { useNavigate } from 'react-router-dom';

const LoginComponent = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };

      const response = await axios.post(
        'https://ws.gmys.com.co/login', // Aquí debes usar la URL del backend
        qs.stringify({
          usuario: username,
          passwd: password,
        }),
        { headers }
      );      
      

      if (response.data.mensaje.estado === 'OK') {
        // Guardamos el ID del usuario en localStorage
        localStorage.setItem('usuario_id', response.data.mensaje.usuario_id);
        navigate('/dashboard'); // Redirigir al Dashboard
      } else {
        setError('Credenciales incorrectas o fallo en el login');
      }
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setError('Error de red o fallo en el servidor');
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Usuario2:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  );
};

export default LoginComponent;
