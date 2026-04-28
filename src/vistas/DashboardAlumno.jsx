import React, { useState } from 'react';
import Navbar from '../componentes/Navbar';

function DashboardAlumno() {
  const [archivo, setArchivo] = useState(null);

  const manejarCambioArchivo = (e) => {
    // Capturamos el archivo seleccionado
    const archivoSeleccionado = e.target.files[0];
    setArchivo(archivoSeleccionado);
    if (archivoSeleccionado) {
      alert("Archivo seleccionado: " + archivoSeleccionado.name);
    }
  };

  const subirCV = () => {
    if (!archivo) {
      alert("Por favor, selecciona un archivo primero.");
      return;
    }
    // Aquí iría la llamada al backend (fetch)
    console.log("Subiendo el archivo...", archivo);
    alert("¡Subida simulada con éxito!");
  };

  return (
    <>
      <Navbar /> {/* <--- ¡Faltaba poner esto aquí! */}
      
      <div style={{ padding: '20px' }}>
        <h2>Panel del Alumno</h2>
        <p>Bienvenido. Gestiona aquí tu currículum para las prácticas.</p>
        
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
          <h4>Estado: {archivo ? 'Listo para subir' : 'Pendiente de entrega'}</h4>
          
          <input 
            type="file" 
            accept=".pdf" 
            onChange={manejarCambioArchivo} 
            style={{ marginBottom: '10px' }}
          />
          <br />
          
          <button 
            onClick={subirCV}
            style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            Enviar Currículum
          </button>
        </div>
      </div>
    </>
  );
}

export default DashboardAlumno;