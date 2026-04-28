import React, { useState, useEffect } from 'react';
import Navbar from '../componentes/Navbar';

function DashboardAlumno() {
  // --- 1. ESTADOS DEL PERFIL ---
  const [perfil, setPerfil] = useState(() => {
    const guardado = localStorage.getItem('perfil_alumno');
    return guardado ? JSON.parse(guardado) : {
      nombre: 'Juan Pérez',
      email: 'juan@alumno.com',
      telefono: '',
      direccion: '',
      ciclo: 'DAM'
    };
  });

  const [editando, setEditando] = useState(false);

  // --- 2. ESTADOS DE ASIGNACIÓN (DATOS QUE VIENEN DEL PROFESOR) ---
  const [datosAsignacion, setDatosAsignacion] = useState({
    estado: 'Pendiente',
    empresa: 'No asignada',
    tutorLaboral: 'No asignado',
    contactoTutor: ''
  });

  // --- 3. ESTADO DEL CV ---
  const [cvSubido, setCvSubido] = useState(localStorage.getItem(`cv_entregado_${perfil.email}`) === 'true');
  const [feedbackCV, setFeedbackCV] = useState(localStorage.getItem(`cv_estado_${perfil.email}`) || 'Pendiente de revisión');

  useEffect(() => {
    // Simulamos la carga de la asignación desde el "servidor" (localStorage)
    const empresaAsignada = localStorage.getItem(`asignacion_empresa_${perfil.email}`);
    const estadoCV = localStorage.getItem(`cv_estado_${perfil.email}`);

    if (empresaAsignada) {
      setDatosAsignacion({
        estado: 'Asignado',
        empresa: empresaAsignada,
        tutorLaboral: 'Carlos Gómez', // En un caso real, esto vendría de la base de datos de la empresa
        contactoTutor: 'carlos.gomez@empresa.com'
      });
    }
    if (estadoCV) setFeedbackCV(estadoCV);
  }, [perfil.email]);

  // --- FUNCIONES ---
  const guardarPerfil = (e) => {
    e.preventDefault();
    localStorage.setItem('perfil_alumno', JSON.stringify(perfil));
    setEditando(false);
    alert("Datos actualizados correctamente");
  };

  const manejarSubidaCV = (e) => {
    const archivo = e.target.files[0];
    if (archivo && archivo.type === "application/pdf") {
      localStorage.setItem(`cv_entregado_${perfil.email}`, 'true');
      setCvSubido(true);
      alert("Currículum PDF subido con éxito");
    } else {
      alert("Por favor, sube un archivo en formato PDF");
    }
  };

  return (
    <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <Navbar />
      
      <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ color: '#1f2937' }}>Mi Panel de FCT</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginTop: '20px' }}>
          
          {/* SECCIÓN 1: PERFIL Y DATOS DE CONTACTO */}
          <section style={estiloCaja}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0 }}>👤 Mis Datos de Contacto</h3>
              <button onClick={() => setEditando(!editando)} style={btnSecundario}>
                {editando ? 'Cancelar' : 'Editar Datos'}
              </button>
            </div>

            <form onSubmit={guardarPerfil}>
              <div style={estiloGrupo}>
                <label style={estiloLabel}>Nombre Completo</label>
                <input 
                  type="text" 
                  disabled={!editando} 
                  value={perfil.nombre} 
                  onChange={(e) => setPerfil({...perfil, nombre: e.target.value})}
                  style={editando ? estiloInput : estiloInputDisabled}
                />
              </div>
              <div style={estiloGrupo}>
                <label style={estiloLabel}>Teléfono</label>
                <input 
                  type="text" 
                  disabled={!editando} 
                  value={perfil.telefono} 
                  placeholder="Ej: 600 000 000"
                  onChange={(e) => setPerfil({...perfil, telefono: e.target.value})}
                  style={editando ? estiloInput : estiloInputDisabled}
                />
              </div>
              <div style={estiloGrupo}>
                <label style={estiloLabel}>Dirección Residencial</label>
                <input 
                  type="text" 
                  disabled={!editando} 
                  value={perfil.direccion} 
                  placeholder="Tu dirección actual"
                  onChange={(e) => setPerfil({...perfil, direccion: e.target.value})}
                  style={editando ? estiloInput : estiloInputDisabled}
                />
              </div>
              {editando && <button type="submit" style={btnPrimario}>Guardar Cambios</button>}
            </form>
          </section>

          {/* SECCIÓN 2: ESTADO DE ASIGNACIÓN */}
          <section style={estiloCaja}>
            <h3>Estado de mi Asignación</h3>
            <div style={estiloStatusCard(datosAsignacion.estado)}>
              <p style={{ margin: 0, fontWeight: 'bold' }}>Estado actual: {datosAsignacion.estado}</p>
            </div>

            <div style={{ marginTop: '20px' }}>
              <p><b>🏢 Empresa:</b> {datosAsignacion.empresa}</p>
              <p><b>👨‍💼 Tutor Laboral:</b> {datosAsignacion.tutorLaboral}</p>
              {datosAsignacion.estado === 'Asignado' && (
                <p><b>📧 Contacto Tutor:</b> {datosAsignacion.contactoTutor}</p>
              )}
            </div>
            
            <hr style={{ border: '0', borderTop: '1px solid #e5e7eb', margin: '20px 0' }} />
            
            <h4>Mi Currículum</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.5rem' }}>{cvSubido ? '📄' : '📁'}</span>
              <div>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>
                  {cvSubido ? 'Archivo CV_Final.pdf subido' : 'No has subido tu CV todavía'}
                </p>
                <small style={{ color: feedbackCV === 'Aceptado' ? '#10b981' : '#f59e0b' }}>
                  Estado CV: <b>{feedbackCV}</b>
                </small>
              </div>
            </div>
            <input 
              type="file" 
              accept=".pdf" 
              onChange={manejarSubidaCV} 
              style={{ marginTop: '15px', fontSize: '0.8rem' }} 
            />
          </section>

        </div>
      </div>
    </div>
  );
}

// --- ESTILOS ---
const estiloCaja = { 
  backgroundColor: 'white', 
  padding: '25px', 
  borderRadius: '12px', 
  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
  border: '1px solid #e5e7eb'
};

const estiloGrupo = { marginBottom: '15px' };
const estiloLabel = { display: 'block', fontSize: '0.85rem', color: '#6b7280', marginBottom: '5px' };

const estiloInput = { 
  width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #3b82f6', boxSizing: 'border-box' 
};

const estiloInputDisabled = { 
  width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', color: '#374151', boxSizing: 'border-box' 
};

const btnPrimario = { 
  backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', width: '100%', fontWeight: 'bold' 
};

const btnSecundario = { 
  backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' 
};

const estiloStatusCard = (estado) => ({
  padding: '10px 15px',
  borderRadius: '8px',
  backgroundColor: estado === 'Asignado' ? '#dcfce7' : '#fef9c3',
  color: estado === 'Asignado' ? '#166534' : '#854d0e',
  border: estado === 'Asignado' ? '1px solid #bbf7d0' : '1px solid #fef08a'
});

export default DashboardAlumno;