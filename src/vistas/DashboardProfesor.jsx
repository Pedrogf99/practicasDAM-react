import React, { useState, useEffect } from 'react';
import Navbar from '../componentes/Navbar';
import Papa from 'papaparse';

function DashboardProfesor() {
  // --- ESTADOS ---
  const [vista, setVista] = useState('alumnos');
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [dragActivo, setDragActivo] = useState(false);
  const [feedbackCV, setFeedbackCV] = useState({});

  const [alumnos, setAlumnos] = useState([
    { id: 1, email: 'pedro@mail.com', nombre: "Pedro Pérez", ciclo: "DAM", empresa: "" },
    { id: 2, email: 'ana@mail.com', nombre: "Ana García", ciclo: "DAW", empresa: "" },
  ]);

  const [empresas, setEmpresas] = useState([
    { id: 1, nombre: "Indra", plazas: 5 },
    { id: 2, nombre: "Everis", plazas: 3 },
    { id: 3, nombre: "Google", plazas: 1 }
  ]);
  const [ciclosDisponibles] = useState(() => {
  const ciclosAdmin = localStorage.getItem('ciclos_fct');
  if (ciclosAdmin) {
    return JSON.parse(ciclosAdmin).map(c => c.nombre);
  }
  return ['DAM', 'DAW', 'ASIR']; // por defecto
});

  const [nuevaEmpresa, setNuevaEmpresa] = useState({ nombre: '', plazas: '', ciclo:'' });

  const [contactos, setContactos] = useState(() => {
    const guardados = localStorage.getItem('seguimiento_empresas');
    return guardados ? JSON.parse(guardados) : [];
  });

  // Estado inicializado correctamente para capturar fecha y hora
  const [nuevoContacto, setNuevoContacto] = useState({ empresaId: '', fecha: '', hora: '', resumen: '' });
  const [mensaje, setMensaje] = useState('');

  // --- LÓGICA DE AUDITORÍA ---
  const registrarLog = (accion) => {
    const logsActuales = JSON.parse(localStorage.getItem('logs_sistema') || '[]');
    const nuevoLog = {
      id: Date.now(),
      usuario: localStorage.getItem('user_email') || 'Profesor',
      accion: accion,
      fecha: new Date().toLocaleString('es-ES')
    };
    localStorage.setItem('logs_sistema', JSON.stringify([nuevoLog, ...logsActuales].slice(0, 50)));
  };

  // --- LÓGICA DE SEGUIMIENTO (CORREGIDA) ---
  const registrarContacto = (e) => {
    e.preventDefault();
    
    // Validación estricta de fecha y hora
    if (!nuevoContacto.empresaId || !nuevoContacto.fecha || !nuevoContacto.hora) {
      return setMensaje("⚠️ Por favor, selecciona empresa, fecha y hora del contacto");
    }

    const contactoFinal = { 
      ...nuevoContacto, 
      id: Date.now() 
    };

    const listaActualizada = [contactoFinal, ...contactos];
    setContactos(listaActualizada);
    localStorage.setItem('seguimiento_empresas', JSON.stringify(listaActualizada));
    
    registrarLog(`Contacto registrado con ${nuevoContacto.empresaId} el ${nuevoContacto.fecha} a las ${nuevoContacto.hora}`);
    
    // Limpieza del formulario
    setNuevoContacto({ empresaId: '', fecha: '', hora: '', resumen: '' });
  };

  const cambiarEstadoCV = (email, nuevoEstado) => {
    localStorage.setItem(`cv_estado_${email}`, nuevoEstado);
    setFeedbackCV(prev => ({ ...prev, [email]: nuevoEstado }));
    registrarLog(`Cambió estado CV de ${email} a ${nuevoEstado}`);
  };

  const obtenerPlazasLibres = (empresaNombre) => {
    const empresa = empresas.find(e => e.nombre === empresaNombre);
    if (!empresa) return 0;
    const ocupadas = alumnos.filter(al => al.empresa === empresaNombre).length;
    return empresa.plazas - ocupadas;
  };

  const asignarEmpresa = (alumnoId, empresaNombre) => {
    const nuevosAlumnos = alumnos.map(al => {
      if (al.id === alumnoId) {
        localStorage.setItem(`asignacion_empresa_${al.email}`, empresaNombre);
        localStorage.setItem(`tutor_academico_${al.email}`, localStorage.getItem('user_nombre') || 'Profesor');
         
        const empresasCompletas = JSON.parse(localStorage.getItem('empresas_completas') || '[]');
      const empresaCompleta = empresasCompletas.find(e => e.nombre === empresaNombre);
      const primerTutor = empresaCompleta?.tutores?.[0];
      if (primerTutor) {
        localStorage.setItem(`tutor_laboral_${al.email}`, primerTutor.nombre);
        localStorage.setItem(`tutor_laboral_tel_${al.email}`, primerTutor.telefono);}
        
              registrarLog(`Asignó a ${al.nombre} a la empresa ${empresaNombre}`);
        return { ...al, empresa: empresaNombre };
      }
      return al;
    });
    setAlumnos(nuevosAlumnos);
  };

  const procesarArchivo = (archivo) => {
    if (archivo) {
      Papa.parse(archivo, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const nuevosAlumnos = results.data.map((fila, index) => ({
            id: Date.now() + index,
            nombre: fila.Nombre || fila.nombre || "Sin nombre",
            email: fila.Email || fila.email || `test${index}@mail.com`,
            ciclo: fila.Ciclo || fila.ciclo || "N/A",
            empresa: ""
          }));
          setAlumnos([...alumnos, ...nuevosAlumnos]);
          registrarLog(`Importó ${nuevosAlumnos.length} alumnos vía CSV`);
        }
      });
    }
  };

  return (
    <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', width: '100%' }}>
      <Navbar />
      
      {/* Contenedor ajustado para pegarse al Nav y centrar el contenido */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px 40px 20px' }}>
        
        {/* Caja Blanca Principal que se une al Nav */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '40px', 
          borderRadius: '0 0 15px 15px', 
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)' 
        }}>
          <h1 style={{ textAlign: 'center', marginTop: '10px', color: '#1f2937' }}>
            Panel de Gestión del Profesor
          </h1>

          {/* NAVEGACIÓN DE PESTAÑAS */}
          {mensaje && (
  <p style={{ textAlign: 'center', color: '#92400e', backgroundColor: '#fef3c7', padding: '10px', borderRadius: '8px', marginBottom: '10px' }}>
    {mensaje}
  </p>
)}
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap', margin: '30px 0' }}>
            <button onClick={() => setVista('alumnos')} style={vista === 'alumnos' ? tabActivo : tabInactivo}>Alumnos y CVs</button>
            <button onClick={() => setVista('empresas')} style={vista === 'empresas' ? tabActivo : tabInactivo}>Plazas Empresas</button>
            <button onClick={() => setVista('seguimiento')} style={vista === 'seguimiento' ? tabActivo : tabInactivo}>Seguimiento</button>
          </div>

          {/* 1. VISTA ALUMNOS */}
          {vista === 'alumnos' && (
            <section>
              <div onDrop={(e) => { e.preventDefault(); setDragActivo(false); procesarArchivo(e.dataTransfer.files[0]) }}
                onDragOver={(e) => { e.preventDefault(); setDragActivo(true) }}
                style={{ ...estiloDrop, backgroundColor: dragActivo ? '#eff6ff' : '#f9fafb' }}>
                <p>📊 <b>Arrastra aquí el CSV</b> para cargar alumnos masivamente</p>
                <input type="file" accept=".csv" onChange={(e) => procesarArchivo(e.target.files[0])} />
              </div>

              <table style={estiloTabla}>
                <thead>
                  <tr style={{ backgroundColor: '#f3f4f6' }}>
                    <th style={estiloCelda}>Alumno</th>
                    <th style={estiloCelda}>Estado CV (Validación)</th>
                    <th style={estiloCelda}>Asignación de Empresa</th>
                    <th style={estiloCelda}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {alumnos.map(al => (
                    <tr key={al.id}>
                      <td style={estiloCelda}>
                        <b>{al.nombre}</b><br />
                        <small style={{ color: '#6b7280' }}>{al.email}</small>
                      </td>
                      <td style={estiloCelda}>
                        {localStorage.getItem(`cv_entregado_${al.email}`) === 'true' ? (
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span>✅</span>
                            <select
                              onChange={(e) => cambiarEstadoCV(al.email, e.target.value)}
                              value={localStorage.getItem(`cv_estado_${al.email}`) || "Pendiente"}
                              style={estiloSelectPequeno}
                            >
                              <option value="Pendiente">⏳ Pendiente</option>
                              <option value="Aceptado">✔️ Aceptado</option>
                              <option value="Rechazado">❌ Rechazar</option>
                            </select>
                          </div>
                        ) : (
                          <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Esperando entrega...</span>
                        )}
                      </td>
                      <td style={estiloCelda}>
                        <select
  value={al.empresa}
  onChange={(e) => asignarEmpresa(al.id, e.target.value)}
  style={estiloInput}
>
  <option value="">Sin asignar</option>
  {empresas
    .filter(em => !em.ciclo || em.ciclo === al.ciclo)
    .map(em => (
      <option
        key={em.id}
        value={em.nombre}
        disabled={obtenerPlazasLibres(em.nombre) <= 0 && al.empresa !== em.nombre}
      >
        {em.nombre} ({obtenerPlazasLibres(em.nombre)} libres)
      </option>
    ))}
</select>
                      </td>
                      <td style={estiloCelda}>
                        <button onClick={() => setAlumnoSeleccionado(al)} style={estiloBotonPerfil}>Ver Ficha</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {/* 2. VISTA EMPRESAS */}
          {vista === 'empresas' && (
            <section>
              <div style={estiloDrop}>
      <p>📊 <b>Arrastra aquí el CSV</b> para cargar empresas masivamente</p>
      <input 
        type="file" 
        accept=".csv" 
        onChange={(e) => {
          const archivo = e.target.files[0];
          if (archivo) {
            Papa.parse(archivo, {
              header: true,
              skipEmptyLines: true,
              complete: (results) => {
                const nuevasEmpresas = results.data.map((fila, index) => ({
                  id: Date.now() + index,
                  nombre: fila.Nombre || fila.nombre || 'Sin nombre',
                  plazas: Number(fila.Plazas || fila.plazas || 0),
                }));
                setEmpresas(prev => [...prev, ...nuevasEmpresas]);
                registrarLog(`Importó ${nuevasEmpresas.length} empresas vía CSV`);
                setMensaje(`✅ ${nuevasEmpresas.length} empresas importadas`);
              }
            });
          }
        }} 
      />
    </div>
              <div style={estiloCajaNaranja}>
                <h3>Añadir Nueva Empresa</h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  setEmpresas([...empresas, { ...nuevaEmpresa, id: Date.now(), plazas: Number(nuevaEmpresa.plazas) }]);
                  setNuevaEmpresa({ nombre: '', plazas: '', ciclo:'' });
                  registrarLog(`Añadió nueva empresa: ${nuevaEmpresa.nombre}`);
                }} style={{ display: 'flex', gap: '10px' }}>
                  <input placeholder="Nombre Empresa" value={nuevaEmpresa.nombre} onChange={e => setNuevaEmpresa({ ...nuevaEmpresa, nombre: e.target.value })} style={estiloInput} required />
                  <input placeholder="Nº Plazas" type="number" value={nuevaEmpresa.plazas} onChange={e => setNuevaEmpresa({ ...nuevaEmpresa, plazas: e.target.value })} style={{ ...estiloInput, width: '120px' }} required />
                  <select 
  value={nuevaEmpresa.ciclo} 
  onChange={e => setNuevaEmpresa({ ...nuevaEmpresa, ciclo: e.target.value })}
  style={{ ...estiloInput, width: '150px' }}
  required
>
  <option value="">Ciclo...</option>
  {ciclosDisponibles.map(c => (
    <option key={c} value={c}>{c}</option>
  ))}
</select>
                  <button type="submit" style={estiloBoton}>Añadir Empresa</button>
                </form>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                 {empresas.map(em => (
  <div key={em.id} style={estiloCard}>
    <h4 style={{ margin: '0 0 10px 0' }}>{em.nombre}</h4>
    <p style={{ margin: '5px 0' }}>Ciclo: <b>{em.ciclo || 'Sin especificar'}</b></p>
    <p style={{ margin: '5px 0' }}>Plazas Totales: <b>{em.plazas}</b></p>
                    <p style={{ margin: '5px 0', color: obtenerPlazasLibres(em.nombre) > 0 ? '#059669' : '#dc2626' }}>
                      Libres actualmente: <b>{obtenerPlazasLibres(em.nombre)}</b>
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 3. VISTA SEGUIMIENTO (CORREGIDA) */}
          {vista === 'seguimiento' && (
            <section>
              <div style={estiloCajaVerde}>
                <h3 style={{marginTop: 0}}>Registro de Llamadas / Visitas</h3>
                <form onSubmit={registrarContacto} style={{ display: 'grid', gap: '10px', gridTemplateColumns: '1fr 1fr 1fr' }}>
                  <select 
                    value={nuevoContacto.empresaId} 
                    onChange={e => setNuevoContacto({ ...nuevoContacto, empresaId: e.target.value })} 
                    style={estiloInput}
                    required
                  >
                    <option value="">Selecciona Empresa...</option>
                    {empresas.map(em => <option key={em.id} value={em.nombre}>{em.nombre}</option>)}
                  </select>
                  <input 
                    type="date" 
                    value={nuevoContacto.fecha} 
                    onChange={e => setNuevoContacto({ ...nuevoContacto, fecha: e.target.value })} 
                    style={estiloInputFecha} 
                    required
                  />
                  <input 
                    type="time" 
                    value={nuevoContacto.hora} 
                    onChange={e => setNuevoContacto({ ...nuevoContacto, hora: e.target.value })} 
                    style={estiloInputFecha} 
                    required
                  />
                  <textarea 
                    placeholder="Resumen de la reunión o llamada..." 
                    value={nuevoContacto.resumen}
                    onChange={e => setNuevoContacto({ ...nuevoContacto, resumen: e.target.value })}
                    style={{ ...estiloInput, gridColumn: 'span 3', height: '80px' }} 
                  />
                  <button type="submit" style={{ ...estiloBoton, gridColumn: 'span 3' }}>Guardar en Historial</button>
                </form>
              </div>

              <h3 style={{ marginTop: '30px' }}>Historial Reciente</h3>
              <table style={estiloTabla}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb' }}>
                    <th style={estiloCelda}>Empresa</th>
                    <th style={estiloCelda}>Fecha y Hora</th>
                    <th style={estiloCelda}>Observaciones</th>
                  </tr>
                </thead>
                <tbody>
                  {contactos.map(c => (
                    <tr key={c.id}>
                      <td style={estiloCelda}><b>{c.empresaId}</b></td>
                      <td style={estiloCelda}>{c.fecha} a las {c.hora}</td>
                      <td style={estiloCelda}>{c.resumen}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
        </div>
      </div>

      {/* MODAL DE DETALLES */}
      {alumnoSeleccionado && (
        <div style={estiloOverlay}>
          <div style={estiloModal}>
            <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Expediente Completo</h2>
            <p><b>Alumno:</b> {alumnoSeleccionado.nombre}</p>
            <p><b>Ciclo:</b> {alumnoSeleccionado.ciclo}</p>
            <p><b>Empresa FCT:</b> {alumnoSeleccionado.empresa || "Pendiente de asignar"}</p>
            <p><b>Estado CV:</b> {localStorage.getItem(`cv_estado_${alumnoSeleccionado.email}`) || "No revisado"}</p>
            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button onClick={() => setAlumnoSeleccionado(null)} style={{ ...estiloBoton, backgroundColor: '#6b7280' }}>Cerrar Ventana</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- ESTILOS ---
const tabActivo = {
  padding: '10px 20px', backgroundColor: '#41c543', color: 'white', border: 'none',
  borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center'
};

const tabInactivo = {
  padding: '10px 20px', backgroundColor: '#e5e7eb', color: '#6b7280', border: 'none',
  borderRadius: '8px', cursor: 'pointer', textAlign: 'center'
};

const estiloDrop = {
  padding: '40px 20px',
  border: '2px dashed #e5e7eb',
  borderRadius: '12px',
  textAlign: 'center',
  marginBottom: '25px',
  backgroundColor: '#f9fafb',
  color: '#4b5563'
};

const estiloInput = {
  width: '100%',
  padding: '10px',
  borderRadius: '6px',
  border: '1px solid #d1d5db',
  boxSizing: 'border-box',
  fontSize: '0.9rem',
  outline: 'none',
  backgroundColor: '#f9fafb',
  color: 'black',
  colorScheme: 'light'
};

const estiloSelectPequeno = {
  padding: '6px 10px',
  borderRadius: '6px',
  border: '1px solid #e5e7eb',
  backgroundColor: '#fff',
  cursor: 'pointer',
  fontSize: '0.85rem',
  color: '#374151',
};

const estiloTabla = {
  width: '100%',
  borderCollapse: 'separate',
  borderSpacing: 0,
  backgroundColor: '#fff',
  borderRadius: '12px',
  overflow: 'hidden',
  border: '1px solid #e5e7eb',
};

const estiloCelda = {
  padding: '15px',
  borderBottom: '1px solid #f3f4f6',
  textAlign: 'left',
  fontSize: '0.9rem',
  color: '#374151',
};

const estiloBoton = {
  padding: '10px 20px',
  color: 'white',
  backgroundColor: '#41c543',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: '600',
  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
};

const estiloBotonPerfil = {
  padding: '8px 16px',
  backgroundColor: '#41c543',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '0.85rem',
  fontWeight: '500',
};
const estiloInputFecha = {
  width: '100%',
  padding: '10px',
  borderRadius: '6px',
  border: '2px solid #d1d5db',
  boxSizing: 'border-box',
  fontSize: '0.9rem',
  outline: 'none',
  backgroundColor: '#ffffff',
  color: '#374151',
  colorScheme: 'light',
  cursor: 'pointer',          // ← el ratón cambia a manita al pasar por encima
  transition: 'border-color 0.2s',
};

const estiloCard = {
  padding: '25px',
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  backgroundColor: '#fff',
  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
};

const estiloCajaVerde = {
  backgroundColor: '#ecfdf5',
  padding: '20px',
  borderRadius: '10px',
  border: '1px solid #d1fae5',
  color: '#065f46',
  marginBottom: '20px'
};

const estiloCajaNaranja = {
  backgroundColor: '#ffffff',
  padding: '20px',
  borderRadius: '10px',
  border: '1px solid #ffedd5',
  color: 'black',
  marginBottom: '25px'
};

const estiloOverlay = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(17, 24, 39, 0.7)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  backdropFilter: 'blur(4px)'
};

const estiloModal = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '16px',
  width: '450px',
  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
  border: '1px solid #f3f4f6',
};

export default DashboardProfesor;