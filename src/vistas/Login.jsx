import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveToken, saveRol } from '../servicios/Autenticacion';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      // 1. Intento de conexión REAL al Backend
      const respuesta = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        saveToken(datos.token);
        saveRol(datos.rol);
        localStorage.setItem('user_email', email);
        window.dispatchEvent(new Event("storage"));
        navigate('/' + datos.rol);
      } else {
        setError(datos.mensaje || 'Credenciales incorrectas');
        setCargando(false); // IMPORTANTE: Liberar el botón si falla
      }
    } catch (err) {
      // 2. MODO SIMULACIÓN (Si el backend no responde)
      console.warn("Backend no disponible. Entrando en modo simulación...");
      
      let rolSimulado = "alumno";
      if (email.includes('profe')) rolSimulado = "profesor";
      if (email.includes('admin')) rolSimulado = "admin";

      saveToken("token_simulado_jwt");
      saveRol(rolSimulado);
      localStorage.setItem('user_email', email);
      window.dispatchEvent(new Event("storage"));
      
      setTimeout(() => {
        setCargando(false);
        navigate('/' + rolSimulado);
      }, 500); // Un poco más de tiempo para que se vea el efecto de carga
    }
  }; // Aquí se cierra correctamente la función manejarEnvio

  return (
    <div style={estiloPagina}>
      <div style={estiloCajaLogin}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ margin: '10px 0 5px 0', color: '#fff' }}>Gestor de Prácticas</h2>
          <p style={{ color: '#acb1ba', fontSize: '0.9rem' }}>Introduce tus credenciales para acceder</p>
        </div>
        
        {error && (
          <div style={{ color: '#ff8a8a', textAlign: 'center', marginBottom: '15px', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={manejarEnvio}>
          <div style={estiloGrupoInput}>
            <label style={estiloLabel}>Correo Electrónico</label>
            <input 
              type="email" 
              required
              placeholder="ejemplo@alumno.com"
              style={estiloInput}
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>

          <div style={estiloGrupoInput}>
            <label style={estiloLabel}>Contraseña</label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              style={estiloInput}
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>

          <button 
            type="submit" 
            disabled={cargando}
            style={{
              ...estiloBoton,
              backgroundColor: cargando ? '#4b6352' : '#41c543',
              cursor: cargando ? 'not-allowed' : 'pointer'
            }}
          >
            {cargando ? 'Accediendo...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}

// --- ESTILOS (Sin cambios significativos, solo ajuste de color en input) ---
const estiloPagina = {
  height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center',
  alignItems: 'center', backgroundColor: '#14564f', position: 'fixed', top: 0, left: 0
};

const estiloCajaLogin = {
  backgroundColor: '#3c8b50', padding: '40px', borderRadius: '16px',
  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)', width: '100%', maxWidth: '400px'
};

const estiloGrupoInput = { marginBottom: '20px' };
const estiloLabel = { display: 'block', marginBottom: '8px', fontSize: '0.875rem', color: '#ffffff' };
const estiloInput = {
  width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #126f3aa3',
  backgroundColor: '#f1f7f0', color: '#333', fontSize: '1rem', boxSizing: 'border-box', outline: 'none'
};

const estiloBoton = {
  width: '100%', padding: '12px', borderRadius: '8px', border: 'none', color: 'white',
  fontSize: '1rem', fontWeight: '600', transition: 'background-color 0.2s', marginTop: '10px'
};

export default Login;