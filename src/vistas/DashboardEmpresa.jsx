import React, { useState, useEffect } from 'react';
import Navbar from '../componentes/Navbar';

function DashboardEmpresa() {
  // --- ESTADOS ---
  const [empresas, setEmpresas] = useState(() => {
    const guardadas = localStorage.getItem('empresas_completas');
    return guardadas ? JSON.parse(guardadas) : [];
  });

  const [editandoId, setEditandoId] = useState(null); // ID de la empresa que se está editando
  const [formData, setFormData] = useState({
    nombre: '', direccion: '', web: '', email: '', telefono: '',
    responsableLegal: { nombre: '', dni: '' }
  });

  // --- VALIDACIONES (Regex) ---
  const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validarDNI = (dni) => /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i.test(dni);
  const validarTelefono = (tel) => /^[6789]\d{8}$/.test(tel);

  useEffect(() => {
    localStorage.setItem('empresas_completas', JSON.stringify(empresas));
  }, [empresas]);

  // --- FUNCIONES CRUD ---

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [obj, key] = name.split('.');
      setFormData({ ...formData, [obj]: { ...formData[obj], [key]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const guardarEmpresa = (e) => {
    e.preventDefault();

    // Aplicar restricciones
    if (!validarEmail(formData.email)) return alert("Email no válido.");
    if (!validarDNI(formData.responsableLegal.dni)) return alert("DNI del responsable no válido (8 números y letra).");
    if (!validarTelefono(formData.telefono)) return alert("Teléfono no válido (9 dígitos).");

    if (editandoId) {
      // UPDATE
      const actualizadas = empresas.map(emp => emp.id === editandoId ? { ...formData, id: editandoId, tutores: emp.tutores } : emp);
      setEmpresas(actualizadas);
      setEditandoId(null);
    } else {
      // CREATE
      setEmpresas([...empresas, { ...formData, id: Date.now(), tutores: [] }]);
    }

    // Resetear form
    setFormData({ nombre: '', direccion: '', web: '', email: '', telefono: '', responsableLegal: { nombre: '', dni: '' } });
  };

  const eliminarEmpresa = (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta empresa y todos sus datos legales?")) {
      setEmpresas(empresas.filter(emp => emp.id !== id));
    }
  };

  const cargarEdicion = (emp) => {
    setEditandoId(emp.id);
    setFormData({
      nombre: emp.nombre,
      direccion: emp.direccion,
      web: emp.web,
      email: emp.email,
      telefono: emp.telefono,
      responsableLegal: emp.responsableLegal
    });
    window.scrollTo(0, 0); // Subir al formulario
  };

  return (
    <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <Navbar />
      <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ color: '#111827' }}>🏢 Gestión Legal de Empresas</h1>

        {/* FORMULARIO DE ALTA Y EDICIÓN */}
        <section style={estiloCajaForm}>
          <h3 style={{ marginTop: 0 }}>{editandoId ? '📝 Editar Ficha' : '➕ Registrar Nueva Entidad'}</h3>
          <form onSubmit={guardarEmpresa} style={estiloFormGrid}>
            <div style={columna}>
              <label style={label}>Datos Generales</label>
              <input name="nombre" placeholder="Nombre de la Empresa" value={formData.nombre} onChange={manejarCambio} style={estiloInput} required />
              <input name="direccion" placeholder="Dirección Postal" value={formData.direccion} onChange={manejarCambio} style={estiloInput} required />
              <input name="web" placeholder="Web (ej: www.empresa.com)" value={formData.web} onChange={manejarCambio} style={estiloInput} />
              <input name="email" placeholder="Email (ej: rrhh@empresa.com)" value={formData.email} onChange={manejarCambio} style={estiloInput} required />
              <input name="telefono" placeholder="Teléfono (9 dígitos)" value={formData.telefono} onChange={manejarCambio} style={estiloInput} required />
            </div>

            <div style={columna}>
              <label style={label}>Representante Legal (Firma de Convenio)</label>
              <input name="responsableLegal.nombre" placeholder="Nombre completo del representante" value={formData.responsableLegal.nombre} onChange={manejarCambio} style={estiloInput} required />
              <input name="responsableLegal.dni" placeholder="DNI (ej: 12345678Z)" value={formData.responsableLegal.dni} onChange={manejarCambio} style={estiloInput} required />
              
              <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <button type="submit" style={btnPrimario}>{editandoId ? 'Actualizar Ficha' : 'Guardar Empresa'}</button>
                {editandoId && <button type="button" onClick={() => setEditandoId(null)} style={btnCancel}>Cancelar</button>}
              </div>
            </div>
          </form>
        </section>

        {/* LISTADO DE EMPRESAS REGISTRADAS */}
        <div style={estiloGridListado}>
          {empresas.map(emp => (
            <div key={emp.id} style={estiloCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                <h3 style={{ margin: 0, color: '#1e40af' }}>{emp.nombre}</h3>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button onClick={() => cargarEdicion(emp)} style={btnIcon}>✏️</button>
                  <button onClick={() => eliminarEmpresa(emp.id)} style={btnIconRed}>🗑️</button>
                </div>
              </div>
              <div style={{ padding: '10px 0', fontSize: '0.9rem' }}>
                <p><b>📍 Dir:</b> {emp.direccion}</p>
                <p><b>📧 Mail:</b> {emp.email}</p>
                <p><b>📞 Tlf:</b> {emp.telefono}</p>
                <p style={{ borderTop: '1px dashed #ddd', paddingTop: '10px', marginTop: '10px' }}>
                  <b>⚖️ Responsable:</b> {emp.responsableLegal.nombre} <br/>
                  <small>DNI: {emp.responsableLegal.dni}</small>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- ESTILOS ---
const estiloCajaForm = { backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '30px' };
const estiloFormGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' };
const columna = { display: 'flex', flexDirection: 'column', gap: '12px' };
const label = { fontWeight: 'bold', color: '#4b5563', marginBottom: '5px' };
const estiloInput = { padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.95rem' };
const btnPrimario = { backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', flex: 1 };
const btnCancel = { backgroundColor: '#6b7280', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '8px', cursor: 'pointer' };
const estiloGridListado = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' };
const estiloCard = { backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', transition: 'transform 0.2s' };
const btnIcon = { background: '#eff6ff', border: 'none', padding: '5px 8px', borderRadius: '4px', cursor: 'pointer' };
const btnIconRed = { background: '#fef2f2', border: 'none', padding: '5px 8px', borderRadius: '4px', cursor: 'pointer' };

export default DashboardEmpresa;