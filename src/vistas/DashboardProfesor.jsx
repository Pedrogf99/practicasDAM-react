import React from 'react';
import Navbar from '../componentes/Navbar';

function DashboardProfesor() {
  // Datos de prueba
  const alumnos = [
    { id: 1, nombre: "Pedro Pérez", ciclo: "DAM", cvSubido: true },
    { id: 2, nombre: "Ana García", ciclo: "DAM", cvSubido: false },
    { id: 3, nombre: "Juan López", ciclo: "DAW", cvSubido: true },
  ];

  const importarCSV = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      alert("Leyendo archivo: " + archivo.name + ". ¡Pronto cargaremos a todos los alumnos!");
    }
  };

  return (
    <>
      <Navbar /> {/* <--- ¡Esto es lo que hace que se vea la barra! */}
      
      <div style={{ padding: '20px' }}>
        <h1>Panel de Gestión - Profesor</h1>
        
        {/* 1. Sección de Importación */}
        <div style={{ 
          backgroundColor: '#f0f7ff', 
          padding: '15px', 
          borderRadius: '8px', 
          marginBottom: '20px', 
          border: '1px solid #007bff' 
        }}>
          <h3>📥 Importar nuevos alumnos</h3>
          <p>Selecciona el archivo .csv exportado de la plataforma del centro:</p>
          <input type="file" accept=".csv" onChange={importarCSV} />
        </div>

        {/* 2. Tabla de Alumnos */}
        <p>Lista de alumnos y estado de sus currículums:</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f4f4f4', textAlign: 'left' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Alumno</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Ciclo</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Estado CV</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {alumnos.map(alumno => (
              <tr key={alumno.id}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{alumno.nombre}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{alumno.ciclo}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  {alumno.cvSubido ? 
                    <span style={{ color: 'green' }}>✅ Entregado</span> : 
                    <span style={{ color: 'red' }}>❌ Pendiente</span>
                  }
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <button disabled={!alumno.cvSubido}>Ver CV</button>
                  <button style={{ marginLeft: '5px' }}>Asignar Empresa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default DashboardProfesor;