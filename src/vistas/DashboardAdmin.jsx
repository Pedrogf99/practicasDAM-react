import React from 'react';

function DashboardAdmin() {
  // Datos de prueba para el Admin
  const ciclos = [
    { id: 1, nombre: "DAM", familia: "Informática", alumnos: 25 },
    { id: 2, nombre: "DAW", familia: "Informática", alumnos: 20 },
    { id: 3, nombre: "ASIR", familia: "Informática", alumnos: 15 },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Panel de Control - Administrador</h1>

      {/* 1. Acciones Rápidas */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <button style={{ padding: '15px', backgroundColor: '#282c34', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          ➕ Crear Nuevo Ciclo
        </button>
        <button style={{ padding: '15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          👤 Gestionar Profesores
        </button>
      </div>

      {/* 2. Tabla de Ciclos Formativos */}
      <h3>Ciclos Activos</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr style={{ backgroundColor: '#eee', textAlign: 'left' }}>
            <th style={{ padding: '12px', border: '1px solid #ccc' }}>Ciclo</th>
            <th style={{ padding: '12px', border: '1px solid #ccc' }}>Familia Profesional</th>
            <th style={{ padding: '12px', border: '1px solid #ccc' }}>Nº Alumnos</th>
            <th style={{ padding: '12px', border: '1px solid #ccc' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ciclos.map(ciclo => (
            <tr key={ciclo.id}>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>{ciclo.nombre}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>{ciclo.familia}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>{ciclo.alumnos}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                <button style={{ color: 'blue', marginRight: '10px', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Editar</button>
                <button style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DashboardAdmin;