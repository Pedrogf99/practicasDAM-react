import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); // Esto detecta cuando cambias de URL
  const [rol, setRol] = useState(localStorage.getItem('user_rol'));

  // Cada vez que cambies de página (URL), la Navbar volverá a mirar el localStorage
  useEffect(() => {
    const rolActual = localStorage.getItem('user_rol');
    setRol(rolActual);
  }, [location]); 

  const cerrarSesion = () => {
    localStorage.clear();
    navigate('/login');
  };

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
      <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
        🚀 Gestor FCT <span style={{fontSize: '0.8rem', color: '#61dafb'}}>| {rol?.toUpperCase() || 'INVITADO'}</span>
      </div>

      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        {rol === 'alumno' && <span>Mi CV</span>}
        {rol === 'profesor' && <span>Gestión Alumnos</span>}
        {rol === 'admin' && <span>Configuración Sistema</span>}

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