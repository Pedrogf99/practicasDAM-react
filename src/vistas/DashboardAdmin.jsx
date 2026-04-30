import React, { useState, useEffect } from 'react';
import Navbar from '../componentes/Navbar';

function DashboardAdmin() {
  const [vista, setVista] = useState('stats'); 
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState('');

  // --- 1. ESTADO: CONFIGURACIÓN GLOBAL (Persistente) ---
  const [configFCT, setConfigFCT] = useState(() => {
    const guardado = localStorage.getItem('config_global_fct');
    return guardado ? JSON.parse(guardado) : { inicio: '', fin: '', estado: 'Abierto' };
  });

  // --- 2. ESTADO: CICLOS ---
  const [ciclos, setCiclos] = useState(() => {
    const guardados = localStorage.getItem('ciclos_fct');
    return guardados ? JSON.parse(guardados) : [
      { id: 1, nombre: 'DAM', inicio: '2023', fin: '2024' },
      { id: 2, nombre: 'DAW', inicio: '2023', fin: '2024' }
    ];
  });
  const [nuevoCiclo, setNuevoCiclo] = useState({ nombre: '', inicio: '', fin: '' });

  // --- 3. ESTADO: PROFESORES ---
  const [profesores, setProfesores] = useState(() => {
    const guardados = localStorage.getItem('profesores_asignados');
    return guardados ? JSON.parse(guardados) : [
      { id: 1, nombre: 'Antonio García', email: 'antonio@centro.es', ciclo: 'DAM' }
    ];
  });
  const [nuevoProfe, setNuevoProfe] = useState({ nombre: '', email: '', ciclo: '' });

  // --- 4. ESTADO: LOGS ---
  const [logs, setLogs] = useState([]);

 useEffect(() => {
  // Guardamos ciclos y profesores (esto parece ir bien)
  localStorage.setItem('ciclos_fct', JSON.stringify(ciclos));
  localStorage.setItem('profesores_asignados', JSON.stringify(profesores));

  // --- CAMBIO CRÍTICO AQUÍ ---
  // Solo guardamos la configuración si tiene datos. 
  // Si inicio y fin están vacíos, NO guardamos para no borrar lo que ya había en el disco.
  if (configFCT.inicio && configFCT.fin) {
    localStorage.setItem('config_global_fct', JSON.stringify(configFCT));
  }

  const logsGuardados = JSON.parse(localStorage.getItem('logs_sistema') || '[]');
  setLogs(logsGuardados);
}, [ciclos, profesores, configFCT]);
  const registrarLog = (accion) => {
    const nuevoLog = { id: Date.now(), usuario: 'ADMIN', accion, fecha: new Date().toLocaleString() };
    const actualizados = [nuevoLog, ...logs].slice(0, 50);
    setLogs(actualizados);
    localStorage.setItem('logs_sistema', JSON.stringify(actualizados));
  };

  // --- FUNCIÓN GUARDAR (CORREGIDA Y ÚNICA) ---
  const guardarConfig = (e) => {
  e.preventDefault();

  if (!configFCT.inicio || !configFCT.fin) {
    return setMensaje("⚠️ Por favor, selecciona ambas fechas");
  }

  const fechaInicio = new Date(configFCT.inicio);
  const fechaFin = new Date(configFCT.fin);

  if (isNaN(fechaInicio) || isNaN(fechaFin)) {
    return setMensaje("⚠️ Alguna de las fechas no es válida");
  }

  if (fechaFin <= fechaInicio) {
    return setMensaje("⚠️ La fecha de fin debe ser posterior a la de inicio");

  }

  // Se guarda en el "disco duro" del navegador
  localStorage.setItem('config_global_fct', JSON.stringify(configFCT));
  
  registrarLog(`Admin actualizó periodo FCT: ${configFCT.inicio} hasta ${configFCT.fin}`);
  
setMensaje("✅ Configuración guardada correctamente");

  // --- EL CAMBIO ESTÁ AQUÍ ---
  // Reseteamos el estado a valores vacíos para que el input muestre dd/mm/aaaa
  setConfigFCT({ inicio: '', fin: '', estado: 'Abierto' });
};

  const manejarSubmitCiclo = (e) => {
    e.preventDefault();
    if (editandoId) {
      setCiclos(ciclos.map(c => c.id === editandoId ? { ...nuevoCiclo, id: editandoId } : c));
      registrarLog(`Editó ciclo: ${nuevoCiclo.nombre}`);
      setEditandoId(null);
    } else {
      setCiclos([...ciclos, { ...nuevoCiclo, id: Date.now() }]);
      registrarLog(`Creó ciclo: ${nuevoCiclo.nombre}`);
    }
    setNuevoCiclo({ nombre: '', inicio: '', fin: '' });
  };

  const eliminarCiclo = (id) => {
    if (window.confirm("¿Borrar ciclo?")) {
      setCiclos(ciclos.filter(c => c.id !== id));
      registrarLog("Eliminó un ciclo formativo");
    }
  };

  const cargarEdicionCiclo = (c) => {
    setNuevoCiclo({ nombre: c.nombre, inicio: c.inicio, fin: c.fin });
    setEditandoId(c.id);
  };

  const manejarSubmitProfe = (e) => {
    e.preventDefault();
    if (editandoId) {
      setProfesores(profesores.map(p => p.id === editandoId ? { ...nuevoProfe, id: editandoId } : p));
      registrarLog(`Editó profesor: ${nuevoProfe.nombre}`);
      setEditandoId(null);
    } else {
      setProfesores([...profesores, { ...nuevoProfe, id: Date.now() }]);
      registrarLog(`Asignó profesor ${nuevoProfe.nombre}`);
    }
    setNuevoProfe({ nombre: '', email: '', ciclo: '' });
  };

  const eliminarProfe = (id) => {
    if (window.confirm("¿Eliminar profesor?")) {
      setProfesores(profesores.filter(p => p.id !== id));
      registrarLog("Eliminó un profesor");
    }
  };

  const cargarEdicionProfe = (p) => {
    setNuevoProfe({ nombre: p.nombre, email: p.email, ciclo: p.ciclo });
    setEditandoId(p.id);
  };

  return (
    <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <Navbar />
      
      <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ marginBottom: '30px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '10px', color:'#111827' }}>Panel de Coordinación</h1>
          {mensaje && (
  <p style={{ textAlign: 'center', color: '#166534', backgroundColor: '#dcfce7', padding: '10px', borderRadius: '8px', margin: '0 0 20px 0' }}>
    {mensaje}
  </p>
)}

          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap', margin:'40px' }}>
            <button onClick={() => {setVista('stats'); setEditandoId(null);}} style={vista === 'stats' ? btnActivo : btnInactivo}>Inicio y Configuración</button>
            <button onClick={() => {setVista('ciclos'); setEditandoId(null);}} style={vista === 'ciclos' ? btnActivo : btnInactivo}>Gestión de Ciclos</button>
            <button onClick={() => {setVista('profesores'); setEditandoId(null);}} style={vista === 'profesores' ? btnActivo : btnInactivo}>Profesores</button>
          </div>
        </header>

        {vista === 'stats' && (
          <div style={{ display: 'grid', gap: '20px' }}>
            <section style={estiloCaja}>
              <h3 style={{ marginTop: 0, color: 'black' }}>Configuración Global de Asignación</h3>
              <form onSubmit={guardarConfig} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', alignItems: 'end' }}>
                <div>
                  <label style={estiloLabel}>Fecha Inicio Periodo</label>
                  <input 
                    type="date"
                    value={configFCT.inicio || ''}
                    onClick={(e) => e.currentTarget.showPicker()} 
                    onChange={(e) => setConfigFCT({ ...configFCT, inicio: e.target.value })}
                    style={{...estiloInput, cursor: 'pointer'}} 
                    required
                  />
                </div>
                <div>
                  <label style={estiloLabel}>Fecha Fin Periodo</label>
                  <input 
                    type="date"
                    value={configFCT.fin || ''}
                    onClick={(e) => e.currentTarget.showPicker()}
                    onChange={(e) => setConfigFCT({ ...configFCT, fin: e.target.value })}
                    style={{...estiloInput, cursor: 'pointer'}}
                    required
                  />
                </div>
                <div>
                  <label style={estiloLabel}>Estado del Sistema</label>
                  <select 
                    value={configFCT.estado} 
                    onChange={e => setConfigFCT({...configFCT, estado: e.target.value})} 
                    style={estiloInput}
                  >
                    <option value="Abierto">🟢 Abierto (Asignaciones)</option>
                    <option value="Cerrado">🔴 Cerrado (Solo lectura)</option>
                  </select>
                </div>
                <button type="submit" style={btnPrimario}>Guardar Cambios</button>
              </form>
            </section>

            <section style={estiloCaja}>
              <h3 style={{ marginTop: 0, color: 'black' }}>Registro de Auditoría Reciente</h3>
              <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f9fafb', zIndex: 1 }}>
                    <tr style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.8rem' }}>
                      <th style={{ padding: '12px' }}>Fecha</th>
                      <th style={{ padding: '12px' }}>Usuario</th>
                      <th style={{ padding: '12px' }}>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map(log => (
                      <tr key={log.id} style={{ borderTop: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '12px', fontSize: '0.85rem', color: '#374151' }}>{log.fecha}</td>
                        <td style={{ padding: '12px' }}><span style={badgeStyle}>ADMIN</span></td>
                        <td style={{ padding: '12px', fontSize: '0.85rem', color: '#374151' }}>{log.accion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {vista === 'ciclos' && (
          <section>
            <div style={estiloCaja}>
              <h3 style={{color:'black', marginTop: 0}}>{editandoId ? 'Editar Ciclo' : 'Crear Ciclo Formativo'}</h3>
              <form onSubmit={manejarSubmitCiclo} style={{ display: 'flex', gap: '10px' }}>
                <input placeholder="Nombre (DAM/DAW...)" value={nuevoCiclo.nombre} onChange={e => setNuevoCiclo({...nuevoCiclo, nombre: e.target.value})} style={estiloInput} required />
                <input placeholder="Año Inicio" value={nuevoCiclo.inicio} onChange={e => setNuevoCiclo({...nuevoCiclo, inicio: e.target.value})} style={estiloInput} required />
                <input placeholder="Año Fin" value={nuevoCiclo.fin} onChange={e => setNuevoCiclo({...nuevoCiclo, fin: e.target.value})} style={estiloInput} required />
                <button type="submit" style={btnPrimario}>{editandoId ? 'Actualizar' : 'Añadir'}</button>
              </form>
            </div>
            <table style={estiloTabla}>
              <thead>
                <tr><th style={estiloTh}>Ciclo</th><th style={estiloTh}>Periodo</th><th style={estiloTh}>Acciones</th></tr>
              </thead>
              <tbody>
                {ciclos.map(c => (
                  <tr key={c.id}>
                    <td style={estiloTd}><b>{c.nombre}</b></td>
                    <td style={estiloTd}>{c.inicio} - {c.fin}</td>
                    <td style={estiloTd}>
                      <button onClick={() => cargarEdicionCiclo(c)} style={btnInactivo}>✏️</button>
                      <button onClick={() => eliminarCiclo(c.id)} style={btnDanger}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {vista === 'profesores' && (
          <section>
            <div style={estiloCaja}>
              <h3 style={{color:'black', marginTop: 0}}>{editandoId ? 'Editar Profesor' : 'Asignar Profesor'}</h3>
<form onSubmit={manejarSubmitProfe} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '15px', alignItems: 'center', overflow: 'hidden' }}>                <input placeholder="Nombre" value={nuevoProfe.nombre} onChange={e => setNuevoProfe({...nuevoProfe, nombre: e.target.value})} style={estiloInput} required />
                <input type="email" placeholder="Email" value={nuevoProfe.email} onChange={e => setNuevoProfe({...nuevoProfe, email: e.target.value})} style={estiloInput} required />
                <select value={nuevoProfe.ciclo} onChange={e => setNuevoProfe({...nuevoProfe, ciclo: e.target.value})} style={estiloInput} required>
                  <option value="">Seleccionar Ciclo...</option>
                  {ciclos.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
                </select>
                <button type="submit" style={btnPrimario}>Asignar</button>
              </form>
            </div>
            <table style={estiloTabla}>
              <thead>
                <tr><th style={estiloTh}>Profesor</th><th style={estiloTh}>Email</th><th style={estiloTh}>Ciclo</th><th style={estiloTh}>Acciones</th></tr>
              </thead>
              <tbody>
                {profesores.map(p => (
                  <tr key={p.id}>
                    <td style={estiloTd}>{p.nombre}</td>
                    <td style={estiloTd}>{p.email}</td>
                    <td style={estiloTd}><span style={badgeStyle}>{p.ciclo}</span></td>
                    <td style={estiloTd}>
                      <button onClick={() => cargarEdicionProfe(p)} style={btnInactivo}>✏️</button>
                      <button onClick={() => eliminarProfe(p.id)} style={btnDanger}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </div>
    </div>
  );
}

// --- ESTILOS (Fuera del componente) ---
const btnActivo = { padding: '10px 20px', backgroundColor: '#41c543', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const btnInactivo = { padding: '10px 20px', backgroundColor: '#e5e7eb', color: '#6b7280', border: 'none', borderRadius: '8px', cursor: 'pointer' };
const btnPrimario = { backgroundColor: '#41c543', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
const btnDanger = { backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', padding: 'px 10px', borderRadius: '4px', cursor: 'pointer' };
const estiloCaja = { backgroundColor: '#ffffff', padding: '25px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '20px' };
const estiloInput = { padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', width: '100%', boxSizing:'border-box', backgroundColor:'#f9fafb', color:'black', colorScheme: 'light' };
const estiloLabel = { display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: '#4b5563', fontWeight: '600' };
const estiloTabla = { width: '100%', borderCollapse: 'collapse', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb' };
const estiloTh = { padding: '15px', color: '#6b7280', backgroundColor: '#f9fafb', textAlign: 'center' };
const estiloTd = { padding: '15px', color: '#374151', borderBottom: '1px solid #f3f4f6' };
const badgeStyle = { backgroundColor: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 'bold' };


export default DashboardAdmin;