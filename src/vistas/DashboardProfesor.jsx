import React, { useState, useEffect } from 'react';
import Navbar from '../componentes/Navbar';
import Papa from 'papaparse';

function DashboardProfesor() {
    useEffect(() => {
    localStorage.setItem('user_rol', 'profesor');
    console.log("Rol cambiado a profesor en LocalStorage");
  }, []);
  const [alumnos, setAlumnos] = useState([
    { id: 1, nombre: "Pedro Pérez", ciclo: "DAM", cvSubido: true },
  ]);
  
  // Estado para controlar el estilo visual cuando arrastramos un archivo
  const [dragActivo, setDragActivo] = useState(false);

  // Función común para procesar el CSV (reutilizable)
  const procesarArchivo = (archivo) => {
    if (archivo) {
      Papa.parse(archivo, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const nuevosAlumnos = results.data.map((fila, index) => ({
            id: Date.now() + index, // Usamos Date.now para IDs únicos
            nombre: fila.Nombre || fila.nombre || "Sin nombre",
            ciclo: fila.Ciclo || fila.ciclo || "N/A",
            cvSubido: false
          }));

          setAlumnos(nuevosAlumnos);
          alert(`¡Éxito! Se han cargado ${nuevosAlumnos.length} alumnos.`);
        },
        error: (error) => {
          console.error("Error:", error);
          alert("Hubo un error al leer el archivo.");
        }
      });
    }
  };

  // Manejadores para el Drag and Drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActivo(true);
    } else if (e.type === "dragleave") {
      setDragActivo(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActivo(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      procesarArchivo(e.dataTransfer.files[0]);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h1>Panel de Gestión - Profesor</h1>
        
        {/* Sección de Importación con Drag and Drop */}
        <div 
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          style={{ 
            backgroundColor: dragActivo ? '#e0efff' : '#f0f7ff', 
            padding: '30px', 
            borderRadius: '12px', 
            marginBottom: '20px', 
            border: dragActivo ? '2px dashed #007bff' : '2px dashed #b1d7ff',
            textAlign: 'center',
            transition: 'all 0.2s ease-in-out'
          }}
        >
          <h3>📥 Importar nuevos alumnos</h3>
          <p>Arrastra tu archivo CSV aquí o selecciona uno de tu equipo</p>
          
          <input 
            type="file" 
            accept=".csv" 
            onChange={(e) => procesarArchivo(e.target.files[0])}
            style={{ marginTop: '10px' }}
          />
          
          {dragActivo && (
            <div style={{ marginTop: '10px', color: '#007bff', fontWeight: 'bold' }}>
              ¡Suelta el archivo para cargar!
            </div>
          )}
        </div>

        {/* Tabla de Alumnos */}
        <p>Lista de alumnos y estado de sus currículums:</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f4f4f4', textAlign: 'left' }}>
              <th style={estiloCelda}>Alumno</th>
              <th style={estiloCelda}>Ciclo</th>
              <th style={estiloCelda}>Estado CV</th>
              <th style={estiloCelda}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {alumnos.map(alumno => (
              <tr key={alumno.id}>
                <td style={estiloCelda}>{alumno.nombre}</td>
                <td style={estiloCelda}>{alumno.ciclo}</td>
                <td style={estiloCelda}>
                  {alumno.cvSubido ? 
                    <span style={{ color: 'green' }}>✅ Entregado</span> : 
                    <span style={{ color: 'red' }}>❌ Pendiente</span>
                  }
                </td>
                <td style={estiloCelda}>
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

const estiloCelda = { padding: '10px', border: '1px solid #ddd' };

export default DashboardProfesor;