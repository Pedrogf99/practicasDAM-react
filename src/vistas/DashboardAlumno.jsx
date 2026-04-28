import React, { useState, useEffect } from 'react';
import Navbar from '../componentes/Navbar';

function DashboardAlumno() {
  useEffect(() => {
    localStorage.setItem('user_rol', 'alumno');
    window.dispatchEvent(new Event("storage"));
  }, []);

  const [archivo, setArchivo] = useState(null);
  const [dragActivo, setDragActivo] = useState(false);

  // Función para validar y guardar el archivo
  const procesarPDF = (archivoSeleccionado) => {
    if (archivoSeleccionado && archivoSeleccionado.type === "application/pdf") {
      setArchivo(archivoSeleccionado);
      alert("PDF listo: " + archivoSeleccionado.name);
    } else {
      alert("Por favor, sube solo archivos PDF.");
    }
  };

  const manejarDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActivo(e.type === "dragenter" || e.type === "dragover");
  };

  const manejarDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActivo(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      procesarPDF(e.dataTransfer.files[0]);
    }
  };

  const subirCV = () => {
    if (!archivo) {
      alert("No hay ningún archivo seleccionado.");
      return;
    }
    console.log("Subiendo PDF a la base de datos...", archivo.name);
    alert("¡Currículum enviado correctamente!");
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h2>Panel del Alumno</h2>
        <p>Gestiona aquí tu currículum para las prácticas.</p>

        {/* Zona de Drag & Drop para el PDF */}
        <div 
          onDragEnter={manejarDrag}
          onDragOver={manejarDrag}
          onDragLeave={manejarDrag}
          onDrop={manejarDrop}
          style={{
            marginTop: '20px',
            border: dragActivo ? '2px dashed #4CAF50' : '2px dashed #ccc',
            backgroundColor: dragActivo ? '#e8f5e9' : '#fafafa',
            padding: '40px',
            borderRadius: '12px',
            textAlign: 'center',
            transition: 'all 0.3s ease'
          }}
        >
          {archivo ? (
            <div>
              <p style={{ color: '#4CAF50', fontWeight: 'bold' }}>📄 {archivo.name}</p>
              <button onClick={() => setArchivo(null)} style={{ fontSize: '0.8rem' }}>Quitar archivo</button>
            </div>
          ) : (
            <p>{dragActivo ? "¡Suelta el PDF!" : "Arrastra tu CV en PDF aquí o haz clic para buscarlo"}</p>
          )}
          
          <input 
            type="file" 
            accept=".pdf" 
            onChange={(e) => procesarPDF(e.target.files[0])}
            style={{ marginTop: '15px' }}
          />
        </div>

        <button 
          onClick={subirCV}
          disabled={!archivo}
          style={{ 
            marginTop: '20px',
            padding: '12px 30px', 
            backgroundColor: archivo ? '#4CAF50' : '#ccc', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: archivo ? 'pointer' : 'not-allowed',
            width: '100%'
          }}
        >
          Enviar Currículum
        </button>
      </div>
    </>
  );
}

export default DashboardAlumno;