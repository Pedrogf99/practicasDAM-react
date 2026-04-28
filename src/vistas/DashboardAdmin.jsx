import React, { useState, useEffect } from 'react';
import Navbar from '../componentes/Navbar';

function DashboardAdmin() {
  // Aseguramos el rol para la Navbar
  useEffect(() => {
    window.dispatchEvent(new Event("storage"));
  }, []);

  // --- ESTADOS ---
  const [vista, setVista] = useState('ciclos'); // 'ciclos' o 'profesores'
  
  const [ciclos, setCiclos] = useState([
    { id: 1, nombre: 'DAM', descripcion: 'Multiplataforma' },
    { id: 2, nombre: 'DAW', descripcion: 'Web' }
  ]);

  const [profesores, setProfesores] = useState([
    { id: 1, nombre: 'Marta García', email: 'marta@insti.com', ciclo: 'DAM' }
  ]);

  // Estados para los formularios
  const [nuevoCiclo, setNuevoCiclo] = useState({ nombre: '', descripcion: '' });
  const [nuevoProfe, setNuevoProfe] = useState({ nombre: '', email: '', ciclo: '' });

  // --- FUNCIONES DE CICLOS ---
  const agregarCiclo = (e) => {
    e.preventDefault();
    if (!nuevoCiclo.nombre) return alert("El nombre del ciclo es obligatorio");
    setCiclos([...ciclos, { ...nuevoCiclo, id: Date.now() }]);
    setNuevoCiclo({ nombre: '', descripcion: '' });
  };

  const eliminarCiclo = (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este ciclo? También afectará a la asignación de profesores.")) {
      setCiclos(ciclos.filter(c => c.id !== id));
    }
  };

  // --- FUNCIONES DE PROFESORES ---
  const agregarProfesor = (e) => {
    e.preventDefault();
    if (!nuevoProfe.nombre || !nuevoProfe.ciclo) return alert("Nombre y Ciclo son obligatorios");
    setProfesores([...profesores, { ...nuevoProfe, id: Date.now() }]);
    setNuevoProfe({ nombre: '', email: '', ciclo: '' });
  };

  const eliminarProfesor = (id) => {
    if (window.confirm("¿Seguro que quieres dar de baja a este profesor?")) {
      setProfesores(profesores.filter(p => p.id !== id));
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
        <h1>Panel de Administración</h1>

        {/* MENU DE PESTAÑAS */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', borderBottom: '2px solid #eee' }}>
          <button 
            onClick={() => setVista('ciclos')}
            style={vista === 'ciclos' ? estiloTabActivo : estiloTab}
          >
            📚 Ciclos Formativos
          </button>
          <button 
            onClick={() => setVista('profesores')}
            style={vista === 'profesores' ? estiloTabActivo : estiloTab}
          >
            👨‍🏫 Profesores
          </button>
        </div>

        {/* CONTENIDO DE CICLOS */}
        {vista === 'ciclos' && (
          <section>
            <div style={estiloPanelForm}>
              <h3>Añadir Ciclo</h3>
              <form onSubmit={agregarCiclo} style={{ display: 'flex', gap: '10px' }}>
                <input 
                  placeholder="Nombre (DAM, DAW...)" 
                  value={nuevoCiclo.nombre}
                  onChange={e => setNuevoCiclo({...nuevoCiclo, nombre: e.target.value})}
                  style={estiloInput} 
                />
                <button type="submit" style={estiloBotonAzul}>+ Crear</button>
              </form>
            </div>

            <div style={gridCards}>
              {ciclos.map(c => (
                <div key={c.id} style={estiloCard}>
                  <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{c.nombre}</div>
                  <button 
                    onClick={() => eliminarCiclo(c.id)}
                    style={estiloBotonEliminar}
                  >
                    🗑 Eliminar
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CONTENIDO DE PROFESORES */}
        {vista === 'profesores' && (
          <section>
            <div style={{ ...estiloPanelForm, backgroundColor: '#f0fdf4' }}>
              <h3>Registrar Profesor</h3>
              <form onSubmit={agregarProfesor} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input 
                  placeholder="Nombre completo" 
                  value={nuevoProfe.nombre}
                  onChange={e => setNuevoProfe({...nuevoProfe, nombre: e.target.value})}
                  style={estiloInput} 
                />
                <select 
                  value={nuevoProfe.ciclo} 
                  onChange={e => setNuevoProfe({...nuevoProfe, ciclo: e.target.value})}
                  style={estiloInput}
                >
                  <option value="">Asignar Ciclo...</option>
                  {ciclos.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
                </select>
                <button type="submit" style={estiloBotonVerde}>Registrar</button>
              </form>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', textAlign: 'left' }}>
                  <th style={estiloCelda}>Nombre</th>
                  <th style={estiloCelda}>Ciclo</th>
                  <th style={estiloCelda}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {profesores.map(p => (
                  <tr key={p.id}>
                    <td style={estiloCelda}>{p.nombre}</td>
                    <td style={estiloCelda}><span style={badge}>{p.ciclo}</span></td>
                    <td style={estiloCelda}>
                      <button onClick={() => eliminarProfesor(p.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </div>
    </>
  );
}

// --- OBJETOS DE ESTILO ---
const estiloTab = { padding: '10px 20px', cursor: 'pointer', border: 'none', background: 'none', fontSize: '1rem', color: '#666', transition: '0.3s' };
const estiloTabActivo = { ...estiloTab, color: '#007bff', borderBottom: '3px solid #007bff', fontWeight: 'bold' };
const estiloPanelForm = { padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ddd' };
const estiloInput = { padding: '10px', borderRadius: '5px', border: '1px solid #ccc', flex: 1 };
const estiloBotonAzul = { padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const estiloBotonVerde = { ...estiloBotonAzul, backgroundColor: '#22c55e' };
const estiloBotonEliminar = { marginTop: '10px', color: '#dc3545', border: '1px solid #dc3545', background: 'none', borderRadius: '4px', cursor: 'pointer', padding: '5px' };
const gridCards = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '15px' };
const estiloCard = { padding: '20px', border: '1px solid #ddd', borderRadius: '10px', textAlign: 'center', backgroundColor: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' };
const estiloCelda = { padding: '12px', borderBottom: '1px solid #eee' };
const badge = { backgroundColor: '#e2e8f0', padding: '4px 10px', borderRadius: '15px', fontSize: '0.85rem' };

export default DashboardAdmin;