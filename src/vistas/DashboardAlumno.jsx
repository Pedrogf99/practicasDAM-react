import React, { useState } from 'react';

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
    <div style={{ padding: '20px' }}>
      <h2>Panel del Alumno</h2>
      <p>Bienvenido. Gestiona aquí tu currículum para las prácticas.</p>
      
      <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        <h4>Estado: {archivo ? 'Listo para subir' : 'Pendiente de entrega'}</h4>
        
        {/* Input de tipo file (el que realmente abre la ventana del PC) */}
        <input 
          type="file" 
          accept=".pdf" 
          onChange={manejarCambioArchivo} 
          style={{ marginBottom: '10px' }}
        />
        <br />
        
        {/* Botón que ejecuta la acción */}
        <button 
          onClick={subirCV}
          style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          Enviar Currículum
        </button>
      </div>
    </div>
  );
}

export default DashboardAlumno;