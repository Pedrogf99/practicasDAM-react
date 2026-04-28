import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./vistas/Login.jsx";
import DashboardAlumno from "./vistas/DashboardAlumno.jsx";
import DashboardProfesor from "./vistas/DashboardProfesor.jsx";
import DashboardAdmin from "./vistas/DashboardAdmin.jsx";
import { getToken, getRol } from './servicios/Autenticacion';
function App() {
  return (
    <Router>
      <div className="App">
        <header style={{ padding: '20px', textAlign: 'center', backgroundColor: '#282c34', color: 'white' }}>
          <h1>Gestor FFEOE</h1>
        </header>

        <main style={{ padding: '20px' }}>
          <Routes>
            {/* 1. Login siempre accesible */}
            <Route path="/login" element={<Login />} />

            {/* 2. Ruta Alumno: Solo si hay token Y el rol es 'alumno' */}
            <Route 
              path="/alumno" 
              element={getToken() && getRol() === 'alumno' ? <DashboardAlumno /> : <Navigate to="/login" />} 
            />

            {/* 3. Ruta Profesor: Solo si hay token Y el rol es 'profesor' */}
            <Route 
              path="/profesor" 
              element={getToken() && getRol() === 'profesor' ? <DashboardProfesor /> : <Navigate to="/login" />} 
            />

            {/* 4. Ruta Admin: Solo si hay token Y el rol es 'admin' */}
            <Route 
              path="/admin" 
              element={getToken() && getRol() === 'admin' ? <DashboardAdmin /> : <Navigate to="/login" />} 
            />

            {/* 5. Si no coincide nada, al login */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;