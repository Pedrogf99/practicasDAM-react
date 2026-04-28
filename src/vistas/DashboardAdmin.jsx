import React, { useState, useEffect } from 'react';
import Navbar from '../componentes/Navbar';

function DashboardAdmin() {
  const [vista, setVista] = useState('stats'); // 'stats', 'ciclos', 'profesores'

  // --- 1. ESTADO: CONFIGURACIÓN GLOBAL (Periodos) ---
  const [configFCT, setConfigFCT] = useState(() => {
    const guardado = localStorage.getItem('config_global_fct');
    return guardado ? JSON.parse(guardado) : { inicio: '', fin: '', estado: 'Abierto' };
  });

  // --- 2. ESTADO: CICLOS (CRUD) ---
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
    // Sincronizar LocalStorage
    localStorage.setItem('ciclos_fct', JSON.stringify(ciclos));
    localStorage.setItem('profesores_asignados', JSON.stringify(profesores));
    localStorage.setItem('config_global_fct', JSON.stringify(configFCT));
    
    // Cargar logs
    const logsGuardados = JSON.parse(localStorage.getItem('logs_sistema') || '[]');
    setLogs(logsGuardados);
  }, [ciclos, profesores, configFCT]);

  // --- FUNCIONES LÓGICAS ---
  const registrarLog = (accion) => {
    const nuevoLog = { id: Date.now(), usuario: 'ADMIN', accion, fecha: new Date().toLocaleString() };
    const actualizados = [nuevoLog, ...logs].slice(0, 50);
    setLogs(actualizados);
    localStorage.setItem('logs_sistema', JSON.stringify(actualizados));
  };

  const guardarConfig = (e) => {
    e.preventDefault();
    localStorage.setItem('config_global_fct', JSON.stringify(configFCT));
    registrarLog(`Actualizó periodo FCT: ${configFCT.inicio} / ${configFCT.fin} (${configFCT.estado})`);
    alert("Configuración global actualizada");
  };

  const agregarCiclo = (e) => {
    e.preventDefault();
    setCiclos([...ciclos, { ...nuevoCiclo, id: Date.now() }]);
    registrarLog(`Creó ciclo: ${nuevoCiclo.nombre}`);
    setNuevoCiclo({ nombre: '', inicio: '', fin: '' });
  };

  const eliminarCiclo = (id) => {
    if (window.confirm("¿Borrar ciclo?")) {
      setCiclos(ciclos.filter(c => c.id !== id));
      registrarLog("Eliminó un ciclo formativo");
    }
  };

  const agregarProfe = (e) => {
    e.preventDefault();
    setProfesores([...profesores, { ...nuevoProfe, id: Date.now() }]);
    registrarLog(`Asignó profesor ${nuevoProfe.nombre} a ${nuevoProfe.ciclo}`);
    setNuevoProfe({ nombre: '', email: '', ciclo: '' });
  };

  return (
    <div style={{ backgroundColor: '#111827', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
      <Navbar />
      
      <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>Panel de Coordinación</h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setVista('stats')} style={vista === 'stats' ? btnActivo : btnInactivo}>📊 Inicio y Configuración</button>
            <button onClick={() => setVista('ciclos')} style={vista === 'ciclos' ? btnActivo : btnInactivo}>🎓 Gestión de Ciclos</button>
            <button onClick={() => setVista('profesores')} style={vista === 'profesores' ? btnActivo : btnInactivo}>👨‍🏫 Profesores</button>
          </div>
        </header>

        {/* --- VISTA: STATS Y CONFIGURACIÓN GLOBAL --- */}
        {vista === 'stats' && (
          <div style={{ display: 'grid', gap: '20px' }}>
            <section style={estiloCaja}>
              <h3 style={{ marginTop: 0 }}>⚙️ Configuración Global de Asignación</h3>
              <form onSubmit={guardarConfig} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', alignItems: 'end' }}>
                <div>
                  <label style={estiloLabel}>Fecha Inicio Periodo</label>
                  <input type="date" value={configFCT.inicio} onChange={e => setConfigFCT({...configFCT, inicio: e.target.value})} style={estiloInput} />
                </div>
                <div>
                  <label style={estiloLabel}>Fecha Fin Periodo</label>
                  <input type="date" value={configFCT.fin} onChange={e => setConfigFCT({...configFCT, fin: e.target.value})} style={estiloInput} />
                </div>
                <div>
                  <label style={estiloLabel}>Estado del Sistema</label>
                  <select value={configFCT.estado} onChange={e => setConfigFCT({...configFCT, estado: e.target.value})} style={estiloInput}>
                    <option value="Abierto">🟢 Abierto (Asignaciones permitidas)</option>
                    <option value="Cerrado">🔴 Cerrado (Solo lectura)</option>
                  </select>
                </div>
                <button type="submit" style={btnPrimario}>Guardar Cambios</button>
              </form>
            </section>

            <section style={estiloCaja}>
              <h3 style={{ marginTop: 0 }}>📜 Registro de Auditoría Reciente</h3>
              <div style={{ maxHeight: '300px', overflowY: 'auto', backgroundColor: '#111827', borderRadius: '8px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', color: '#9ca3af', fontSize: '0.8rem' }}>
                      <th style={{ padding: '10px' }}>Fecha</th>
                      <th style={{ padding: '10px' }}>Usuario</th>
                      <th style={{ padding: '10px' }}>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map(log => (
                      <tr key={log.id} style={{ borderTop: '1px solid #1f2937' }}>
                        <td style={{ padding: '10px', fontSize: '0.85rem' }}>{log.fecha}</td>
                        <td style={{ padding: '10px' }}><span style={badge}>{log.usuario}</span></td>
                        <td style={{ padding: '10px', fontSize: '0.85rem' }}>{log.accion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* --- VISTA: GESTIÓN DE CICLOS --- */}
        {vista === 'ciclos' && (
          <section>
            <div style={estiloCaja}>
              <h3>Crear Ciclo Formativo</h3>
              <form onSubmit={agregarCiclo} style={{ display: 'flex', gap: '10px' }}>
                <input placeholder="Nombre (DAM/DAW...)" value={nuevoCiclo.nombre} onChange={e => setNuevoCiclo({...nuevoCiclo, nombre: e.target.value})} style={estiloInput} required />
                <input placeholder="Año Inicio" value={nuevoCiclo.inicio} onChange={e => setNuevoCiclo({...nuevoCiclo, inicio: e.target.value})} style={estiloInput} required />
                <input placeholder="Año Fin" value={nuevoCiclo.fin} onChange={e => setNuevoCiclo({...nuevoCiclo, fin: e.target.value})} style={estiloInput} required />
                <button type="submit" style={btnPrimario}>Añadir</button>
              </form>
            </div>
            <table style={estiloTabla}>
              <thead>
                <tr style={{ textAlign: 'left', backgroundColor: '#374151' }}>
                  <th style={estiloTh}>Nombre del Ciclo</th>
                  <th style={estiloTh}>Periodo Vigente</th>
                  <th style={estiloTh}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ciclos.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #374151' }}>
                    <td style={estiloTd}><b>{c.nombre}</b></td>
                    <td style={estiloTd}>{c.inicio} - {c.fin}</td>
                    <td style={estiloTd}><button onClick={() => eliminarCiclo(c.id)} style={btnDanger}>Borrar</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* --- VISTA: GESTIÓN DE PROFESORES --- */}
        {vista === 'profesores' && (
          <section>
            <div style={estiloCaja}>
              <h3>Asignar Profesor a Ciclo</h3>
              <form onSubmit={agregarProfe} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '10px' }}>
                <input placeholder="Nombre Completo" value={nuevoProfe.nombre} onChange={e => setNuevoProfe({...nuevoProfe, nombre: e.target.value})} style={estiloInput} required />
                <input placeholder="Email" value={nuevoProfe.email} onChange={e => setNuevoProfe({...nuevoProfe, email: e.target.value})} style={estiloInput} required />
                <select value={nuevoProfe.ciclo} onChange={e => setNuevoProfe({...nuevoProfe, ciclo: e.target.value})} style={estiloInput} required>
                  <option value="">Seleccionar Ciclo...</option>
                  {ciclos.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
                </select>
                <button type="submit" style={btnPrimario}>Asignar</button>
              </form>
            </div>
            <table style={estiloTabla}>
              <thead>
                <tr style={{ textAlign: 'left', backgroundColor: '#374151' }}>
                  <th style={estiloTh}>Profesor</th>
                  <th style={estiloTh}>Email</th>
                  <th style={estiloTh}>Ciclo</th>
                </tr>
              </thead>
              <tbody>
                {profesores.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #374151' }}>
                    <td style={estiloTd}>{p.nombre}</td>
                    <td style={estiloTd}>{p.email}</td>
                    <td style={estiloTd}><span style={badge}>{p.ciclo}</span></td>
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

// --- ESTILOS ---
const btnActivo = { padding: '10px 20px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const btnInactivo = { padding: '10px 20px', backgroundColor: '#1f2937', color: '#9ca3af', border: 'none', borderRadius: '8px', cursor: 'pointer' };
const btnPrimario = { backgroundColor: '#10b981', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
const btnDanger = { backgroundColor: '#7f1d1d', color: '#fca5a5', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' };
const estiloCaja = { backgroundColor: '#1f2937', padding: '20px', borderRadius: '12px', border: '1px solid #374151' };
const estiloInput = { padding: '10px', borderRadius: '6px', border: '1px solid #374151', backgroundColor: '#111827', color: 'white', width: '100%', boxSizing: 'border-box' };
const estiloLabel = { display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: '#9ca3af' };
const estiloTabla = { width: '100%', borderCollapse: 'collapse', backgroundColor: '#1f2937', borderRadius: '12px', overflow: 'hidden', marginTop: '20px' };
const estiloTh = { padding: '15px', color: '#9ca3af', fontWeight: '500' };
const estiloTd = { padding: '15px' };
const badge = { backgroundColor: '#3b82f6', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' };

export default DashboardAdmin;