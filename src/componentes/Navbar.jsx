import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const rol = localStorage.getItem('user_rol'); // Leemos quién es el usuario

  const cerrarSesion = () => {
    localStorage.clear(); // Borramos token y rol
    navigate('/login');   // ¡A la calle!
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
        🚀 Gestor FCT <span style={{fontSize: '0.8rem', color: '#61dafb'}}>| {rol?.toUpperCase()}</span>
      </div>

      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        {/* Enlaces dinámicos según el rol */}
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