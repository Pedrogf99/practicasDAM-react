import React, { useState, useEffect } from 'react';
import Navbar from '../componentes/Navbar';
import Papa from 'papaparse';

function DashboardProfesor() {
  // --- ESTADOS ---
  const [vista, setVista] = useState('alumnos'); 
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null); 
  const [dragActivo, setDragActivo] = useState(false);

  // Datos de Alumnos
  const [alumnos, setAlumnos] = useState([
    { id: 1, email: 'pedro@mail.com', nombre: "Pedro Pérez", ciclo: "DAM", empresa: "" },
    { id: 2, email: 'ana@mail.com', nombre: "Ana García", ciclo: "DAW", empresa: "" },
  ]);

  // Datos de Empresas (Punto 18)
  const [empresas, setEmpresas] = useState([
    { id: 1, nombre: "Indra", plazas: 2 },
    { id: 2, nombre: "Everis", plazas: 1 }
  ]);

  const [nuevaEmpresa, setNuevaEmpresa] = useState({ nombre: '', plazas: '' });

  // Estado para Seguimiento (Punto 17)
  const [contactos, setContactos] = useState(() => {
    const guardados = localStorage.getItem('seguimiento_empresas');
    return guardados ? JSON.parse(guardados) : [];
  });

  const [nuevoContacto, setNuevoContacto] = useState({ empresaId: '', fecha: '', hora: '', resumen: '' });

  // --- LÓGICA DE PLAZAS DINÁMICAS (Punto 19) ---
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
        return { ...al, empresa: empresaNombre };
      }
      return al;
    });
    setAlumnos(nuevosAlumnos);
  };

  // --- LÓGICA DE SEGUIMIENTO (Punto 17) ---
  const registrarContacto = (e) => {
    e.preventDefault();
    if (!nuevoContacto.empresaId || !nuevoContacto.fecha) return alert("Faltan datos del contacto");
    const listaActualizada = [...contactos, { ...nuevoContacto, id: Date.now() }];
    setContactos(listaActualizada);
    localStorage.setItem('seguimiento_empresas', JSON.stringify(listaActualizada));
    setNuevoContacto({ empresaId: '', fecha: '', hora: '', resumen: '' });
    alert("Contacto registrado en el historial");
  };

  // --- LÓGICA DE IMPORTACIÓN ---
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
        }
      });
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto', fontFamily: 'sans-serif' }}>
        <h1>Panel del Profesor</h1>

        {/* NAVEGACIÓN */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', borderBottom: '1px solid #ddd' }}>
          <button onClick={() => setVista('alumnos')} style={vista === 'alumnos' ? tabActivo : tabInactivo}>👥 Alumnos</button>
          <button onClick={() => setVista('empresas')} style={vista === 'empresas' ? tabActivo : tabInactivo}>🏢 Empresas</button>
          <button onClick={() => setVista('seguimiento')} style={vista === 'seguimiento' ? tabActivo : tabInactivo}>📞 Seguimiento</button>
        </div>

        {/* 1. SECCIÓN ALUMNOS */}
        {vista === 'alumnos' && (
          <section>
            <div onDrop={(e) => {e.preventDefault(); setDragActivo(false); procesarArchivo(e.dataTransfer.files[0])}} 
                 onDragOver={(e) => {e.preventDefault(); setDragActivo(true)}}
                 style={{ ...estiloDrop, backgroundColor: dragActivo ? '#f0f7ff' : '#f9fafb' }}>
              <p>📂 Arrastra el CSV de alumnos aquí</p>
              <input type="file" accept=".csv" onChange={(e) => procesarArchivo(e.target.files[0])} />
            </div>
            <table style={estiloTabla}>
              <thead>
                <tr style={{ backgroundColor: '#f3f4f6', textAlign: 'left' }}>
                  <th style={estiloCelda}>Alumno</th>
                  <th style={estiloCelda}>CV</th>
                  <th style={estiloCelda}>Asignación Plaza</th>
                  <th style={estiloCelda}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {alumnos.map(al => (
                  <tr key={al.id}>
                    <td style={estiloCelda}><b>{al.nombre}</b><br/><small>{al.email}</small></td>
                    <td style={estiloCelda}>{localStorage.getItem(`cv_entregado_${al.email}`) === 'true' ? '✅' : '❌'}</td>
                    <td style={estiloCelda}>
                      <select value={al.empresa} onChange={(e) => asignarEmpresa(al.id, e.target.value)} style={estiloInput}>
                        <option value="">Seleccionar...</option>
                        {empresas.map(em => (
                          <option key={em.id} value={em.nombre} disabled={obtenerPlazasLibres(em.nombre) <= 0 && al.empresa !== em.nombre}>
                            {em.nombre} ({obtenerPlazasLibres(em.nombre)} libres)
                          </option>
                        ))}
                      </select>
                    </td>
                    <td style={estiloCelda}><button onClick={() => setAlumnoSeleccionado(al)} style={estiloBotonPerfil}>Ficha</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* 2. SECCIÓN EMPRESAS */}
        {vista === 'empresas' && (
          <section>
            <div style={estiloCajaNaranja}>
              <h3>Añadir Nueva Empresa</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                setEmpresas([...empresas, { ...nuevaEmpresa, id: Date.now(), plazas: Number(nuevaEmpresa.plazas) }]);
                setNuevaEmpresa({ nombre: '', plazas: '' });
              }} style={{ display: 'flex', gap: '10px' }}>
                <input placeholder="Nombre" value={nuevaEmpresa.nombre} onChange={e => setNuevaEmpresa({...nuevaEmpresa, nombre: e.target.value})} style={estiloInput} />
                <input placeholder="Plazas" type="number" value={nuevaEmpresa.plazas} onChange={e => setNuevaEmpresa({...nuevaEmpresa, plazas: e.target.value})} style={{...estiloInput, width: '100px'}} />
                <button type="submit" style={{...estiloBoton, backgroundColor: '#f59e0b'}}>Guardar</button>
              </form>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
              {empresas.map(em => (
                <div key={em.id} style={estiloCard}>
                  <h4>{em.nombre}</h4>
                  <p>Plazas totales: {em.plazas}</p>
                  <p><b>Libres: {obtenerPlazasLibres(em.nombre)}</b></p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. SECCIÓN SEGUIMIENTO (Punto 17 REINSTAURADO) */}
        {vista === 'seguimiento' && (
          <section>
            <div style={estiloCajaVerde}>
              <h3>Registrar Contacto con Empresa</h3>
              <form onSubmit={registrarContacto} style={{ display: 'grid', gap: '10px', gridTemplateColumns: '1fr 1fr 1fr' }}>
                <select value={nuevoContacto.empresaId} onChange={e => setNuevoContacto({...nuevoContacto, empresaId: e.target.value})} style={estiloInput}>
                  <option value="">Empresa...</option>
                  {empresas.map(em => <option key={em.id} value={em.nombre}>{em.nombre}</option>)}
                </select>
                <input type="date" value={nuevoContacto.fecha} onChange={e => setNuevoContacto({...nuevoContacto, fecha: e.target.value})} style={estiloInput} />
                <input type="time" value={nuevoContacto.hora} onChange={e => setNuevoContacto({...nuevoContacto, hora: e.target.value})} style={estiloInput} />
                <textarea placeholder="Resumen de la conversación..." value={nuevoContacto.resumen} 
                          onChange={e => setNuevoContacto({...nuevoContacto, resumen: e.target.value})} 
                          style={{...estiloInput, gridColumn: 'span 3', height: '60px'}} />
                <button type="submit" style={{...estiloBoton, backgroundColor: '#16a34a', gridColumn: 'span 3'}}>Guardar en Historial</button>
              </form>
            </div>

            <h3 style={{ marginTop: '30px' }}>Historial de Contactos</h3>
            <table style={estiloTabla}>
              <thead>
                <tr style={{ backgroundColor: '#eee' }}>
                  <th style={estiloCelda}>Empresa</th>
                  <th style={estiloCelda}>Fecha / Hora</th>
                  <th style={estiloCelda}>Resumen</th>
                </tr>
              </thead>
              <tbody>
                {contactos.length === 0 ? <tr><td colSpan="3" style={{textAlign:'center', padding:'20px'}}>No hay contactos registrados.</td></tr> : 
                  contactos.map(c => (
                    <tr key={c.id}>
                      <td style={estiloCelda}>{c.empresaId}</td>
                      <td style={estiloCelda}>{c.fecha} - {c.hora}</td>
                      <td style={estiloCelda}>{c.resumen}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </section>
        )}

        {/* MODAL FICHA */}
        {alumnoSeleccionado && (
          <div style={estiloOverlay}>
            <div style={estiloModal}>
              <h2>Expediente Alumno</h2>
              <p><b>Nombre:</b> {alumnoSeleccionado.nombre}</p>
              <p><b>Email:</b> {alumnoSeleccionado.email}</p>
              <p><b>Empresa:</b> {alumnoSeleccionado.empresa || "Sin asignar"}</p>
              <button onClick={() => setAlumnoSeleccionado(null)} style={{...estiloBoton, backgroundColor: '#4b5563'}}>Cerrar</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// --- ESTILOS ---
const tabActivo = { padding: '10px 20px', border: 'none', borderBottom: '3px solid #3b82f6', background: 'none', fontWeight: 'bold', cursor: 'pointer', color: '#3b82f6' };
const tabInactivo = { padding: '10px 20px', border: 'none', background: 'none', color: '#6b7280', cursor: 'pointer' };
const estiloDrop = { padding: '20px', border: '2px dashed #ccc', borderRadius: '8px', textAlign: 'center', marginBottom: '20px' };
const estiloTabla = { width: '100%', borderCollapse: 'collapse', marginTop: '10px' };
const estiloCelda = { padding: '12px', borderBottom: '1px solid #eee', textAlign: 'left' };
const estiloInput = { padding: '8px', borderRadius: '4px', border: '1px solid #ddd' };
const estiloBoton = { padding: '10px 15px', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };
const estiloBotonPerfil = { padding: '5px 10px', backgroundColor: '#374151', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };
const estiloCard = { padding: '15px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff' };
const estiloCajaVerde = { backgroundColor: '#f0fdf4', padding: '15px', borderRadius: '8px', border: '1px solid #bbf7d0' };
const estiloCajaNaranja = { backgroundColor: '#fff7ed', padding: '15px', borderRadius: '8px', border: '1px solid #ffedd5', marginBottom: '20px' };
const estiloOverlay = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const estiloModal = { backgroundColor: 'white', padding: '25px', borderRadius: '12px', width: '350px' };

export default DashboardProfesor;