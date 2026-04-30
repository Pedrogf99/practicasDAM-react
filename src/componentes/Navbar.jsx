import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [rol, setRol] = useState(localStorage.getItem('user_rol'));

  // Actualiza el rol cada vez que cambias de página
  useEffect(() => {
    setRol(localStorage.getItem('user_rol'));
  }, [location]);

  // Escucha el evento que lanza el Login cuando guarda el rol
  useEffect(() => {
    const actualizarRol = () => setRol(localStorage.getItem('user_rol'));
    window.addEventListener('storage', actualizarRol);
    return () => window.removeEventListener('storage', actualizarRol);
  }, []);

  const cerrarSesion = () => {
  localStorage.removeItem('token_gestor');
  localStorage.removeItem('user_email');
  localStorage.removeItem('user_rol');
  localStorage.removeItem('user_nombre');
  navigate('/login');
};

  // Enlaces por rol
  const enlaces = {
    alumno:   [{ path: '/alumno',   label: '📄 Mi Panel' }],
    profesor: [{ path: '/profesor', label: '👥 Gestión Alumnos' },
               { path: '/empresa',  label: '🏢 Empresas' }],
    admin:    [{ path: '/admin',    label: '⚙️ Configuración' }],
  };

  const linksActuales = enlaces[rol] || [];

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 20px',
      backgroundColor: '#282c34',
      color: 'white',
      marginBottom: '20px'
    }}>
      {/* Logo */}
      <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
        🚀 Gestor FCT{' '}
        <span style={{ fontSize: '0.8rem', color: '#61dafb' }}>
          | {rol?.toUpperCase() || 'INVITADO'}
        </span>
      </div>

      {/* Links + botón */}
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
      

        <button
          onClick={cerrarSesion}
          style={{
            padding: '5px 10px',
            backgroundColor: '#ff4d4d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
}

export default Navbar;