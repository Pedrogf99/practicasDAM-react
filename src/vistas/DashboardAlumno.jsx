import React, { useState, useEffect } from 'react';
import Navbar from '../componentes/Navbar';

function DashboardAlumno() {
  // 1. Datos del usuario (En un proyecto real vendrían del Login/AuthContext)
  const [usuario] = useState({
    nombre: "Pedro Pérez",
    email: "pedro@mail.com",
    ciclo: "DAM"
  });

  // 2. Estados para la asignación, CV y Tutor
  const [asignacion, setAsignacion] = useState(null);
  const [cvSubido, setCvSubido] = useState(false);
  const [datosTutor, setDatosTutor] = useState({ nombre: '', telefono: '' });

  // 3. Carga de datos desde LocalStorage (Simulando la base de datos)
  useEffect(() => {
    // Comprobamos si el profesor asignó una empresa
    const empresaAsignada = localStorage.getItem(`asignacion_empresa_${usuario.email}`);
    
    if (empresaAsignada) {
      setAsignacion(empresaAsignada);
      
      // Mejora: Leemos los datos del tutor que el profesor guardó (Punto 22 y 25)
      setDatosTutor({
        nombre: localStorage.getItem(`tutor_nombre_${usuario.email}`) || 'Asignando tutor...',
        telefono: localStorage.getItem(`tutor_tlf_${usuario.email}`) || ''
      });
    }

    // Comprobamos si el alumno ya subió su CV (Punto 21)
    const estadoCV = localStorage.getItem(`cv_entregado_${usuario.email}`) === 'true';
    setCvSubido(estadoCV);
  }, [usuario.email]);

  // 4. Función para subir el CV (Requisito 21)
  const manejarSubidaCV = (e) => {
    const archivo = e.target.files[0];
    if (archivo && archivo.type === "application/pdf") {
      localStorage.setItem(`cv_entregado_${usuario.email}`, 'true');
      setCvSubido(true);
      alert("Currículum PDF subido correctamente. El profesor ya puede verlo.");
    } else {
      alert("Error: Por favor, selecciona un archivo en formato PDF.");
    }
  };

  return (
    <>
      <Navbar />
      <div style={estiloContenedor}>
        <header style={estiloHeader}>
          <h1>Mi Perfil de Prácticas</h1>
          <p>Bienvenido, <b>{usuario.nombre}</b> | Ciclo: {usuario.ciclo}</p>
        </header>

        <div style={estiloGrid}>
          
          {/* TARJETA 1: ESTADO DE ASIGNACIÓN (Requisito 22) */}
          <section style={estiloCard}>
            <h3>📍 Estado de mi FCT</h3>
            <div style={asignacion ? estiloBannerExito : estiloBannerPendiente}>
              {asignacion ? (
                <>
                  <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
                    <b>Empresa:</b> {asignacion}
                  </p>
                  <div style={estiloCajaTutor}>
                    <p style={{ margin: '0 0 5px 0' }}><b>Tutor Laboral:</b> {datosTutor.nombre}</p>
                    {datosTutor.telefono && (
                      <p style={{ margin: 0, fontSize: '0.9rem' }}>
                        📞 Teléfono: {datosTutor.telefono}
                      </p>
                    )}
                  </div>
                  <p style={{ marginTop: '15px', fontSize: '0.85rem', color: '#166534' }}>
                    ✅ Tu asignación está completa.
                  </p>
                </>
              ) : (
                <p><b>Estado:</b> Pendiente de asignación por el profesor</p>
              )}
            </div>
          </section>

          {/* TARJETA 2: GESTIÓN DE CV (Requisito 21) */}
          <section style={estiloCard}>
            <h3>📄 Mi Currículum Vitae (PDF)</h3>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              {cvSubido ? (
                <div>
                  <span style={{ fontSize: '3rem' }}>✅</span>
                  <p style={{ color: '#16a34a', fontWeight: 'bold' }}>CV entregado correctamente</p>
                  <p style={{ fontSize: '0.8rem', color: '#666' }}>El profesor ya tiene acceso a tu archivo.</p>
                  <button 
                    onClick={() => { 
                      if(window.confirm("¿Quieres eliminar el CV actual para subir uno nuevo?")) {
                        localStorage.removeItem(`cv_entregado_${usuario.email}`); 
                        setCvSubido(false); 
                      }
                    }}
                    style={estiloBotonSecundario}
                  >
                    Sustituir archivo
                  </button>
                </div>
              ) : (
                <div>
                  <p style={{ marginBottom: '20px', color: '#4b5563' }}>
                    Es obligatorio subir tu CV en formato PDF para que el profesor pueda asignarte una empresa.
                  </p>
                  <input 
                    type="file" 
                    accept=".pdf" 
                    onChange={manejarSubidaCV} 
                    id="upload-cv"
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="upload-cv" style={estiloBotonPrimario}>
                    Seleccionar PDF
                  </label>
                </div>
              )}
            </div>
          </section>

        </div>
      </div>
    </>
  );
}

// --- ESTILOS MEJORADOS ---
const estiloContenedor = { padding: '30px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' };
const estiloHeader = { marginBottom: '30px', borderBottom: '2px solid #e5e7eb', paddingBottom: '15px' };
const estiloGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '25px' };
const estiloCard = { backgroundColor: '#fff', padding: '25px', borderRadius: '15px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', border: '1px solid #f3f4f6' };
const estiloBannerPendiente = { backgroundColor: '#fffbeb', color: '#92400e', padding: '20px', borderRadius: '10px', border: '1px solid #fef3c7' };
const estiloBannerExito = { backgroundColor: '#f0fdf4', color: '#166534', padding: '20px', borderRadius: '10px', border: '1px solid #dcfce7' };
const estiloCajaTutor = { marginTop: '10px', padding: '12px', backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: '8px', border: '1px solid rgba(22, 101, 52, 0.1)' };
const estiloBotonPrimario = { display: 'inline-block', backgroundColor: '#2563eb', color: 'white', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: 'background 0.2s' };
const estiloBotonSecundario = { background: 'none', border: '1px solid #d1d5db', color: '#4b5563', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', marginTop: '15px', fontSize: '0.9rem' };

export default DashboardAlumno;