import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveToken, saveRol } from '../servicios/Autenticacion';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const manejarEnvio = async (e) => {
    e.preventDefault();
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
        
        // Disparamos evento para que la Navbar se entere si está presente
        window.dispatchEvent(new Event("storage"));
        navigate('/' + datos.rol);
      } else {
        alert("Error: " + datos.mensaje);
      }
    } catch (error) {
      // 2. MODO SIMULACIÓN (Si el backend no responde)
      console.warn("Backend no disponible. Entrando en modo simulación...");
      
      let rolSimulado = "alumno";
      if (email.includes('profe')) rolSimulado = "profesor";
      if (email.includes('admin')) rolSimulado = "admin";

      saveToken("token_simulado_jwt");
      saveRol(rolSimulado);
      localStorage.setItem('user_email', email);
      
      window.dispatchEvent(new Event("storage"));
      navigate('/' + rolSimulado);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={estiloPagina}>
      <div style={estiloCajaLogin}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <span style={{ fontSize: '3rem' }}>🚀</span>
          <h2 style={{ margin: '10px 0 5px 0', color: '#fff' }}>Gestor FFEOE</h2>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Introduce tus credenciales para acceder</p>
        </div>

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
              backgroundColor: cargando ? '#4b5563' : '#3b82f6'
            }}
          >
            {cargando ? 'Accediendo...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.8rem', color: '#6b7280' }}>
          <p>Usa un correo con "profe" para entrar como profesor en modo simulación.</p>
        </div>
      </div>
    </div>
  );
}

// --- ESTILOS ---
const estiloPagina = {
  height: '100vh',
  width: '100vw',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#111827', // Fondo oscuro que coincide con tu captura
  margin: 0,
  padding: 0,
  position: 'fixed',
  top: 0,
  left: 0
};

const estiloCajaLogin = {
  backgroundColor: '#1f2937',
  padding: '40px',
  borderRadius: '16px',
  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
  width: '100%',
  maxWidth: '400px',
  border: '1px solid #374151'
};

const estiloGrupoInput = {
  marginBottom: '20px'
};

const estiloLabel = {
  display: 'block',
  marginBottom: '8px',
  fontSize: '0.875rem',
  fontWeight: '500',
  color: '#d1d5db'
};

const estiloInput = {
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #4b5563',
  backgroundColor: '#374151',
  color: '#fff',
  fontSize: '1rem',
  boxSizing: 'border-box',
  outline: 'none'
};

const estiloBoton = {
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  border: 'none',
  color: 'white',
  fontSize: '1rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  marginTop: '10px'
};

export default Login;