import { useState } from 'react';

function DashboardAlumno() {
  const [archivo, setArchivo] = useState(null);

  const subirPDF = (e) => {
    e.preventDefault();
    if (!archivo) return alert("Por favor, selecciona un archivo primero");
    
    // Aquí es donde en el futuro enviaremos el PDF al Backend
    console.log("Subiendo archivo:", archivo.name);
    alert(`Archivo ${archivo.name} listo para enviarse al servidor`);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', marginTop: '20px' }}>
      <h3>Panel del Alumno</h3>
      <p><strong>Estado:</strong> <span style={{color: 'orange'}}>Pendiente de Asignación</span></p>
      
      <hr />
      
      <h4>Subir Currículum (PDF)</h4>
      <form onSubmit={subirPDF}>
        <input 
          type="file" 
          accept=".pdf" 
          onChange={(e) => setArchivo(e.target.files[0])} 
        />
        <button type="submit" style={{ marginLeft: '10px' }}>Subir CV</button>
      </form>
    </div>
  );
}

export default DashboardAlumno;