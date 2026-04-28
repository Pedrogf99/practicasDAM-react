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
        {/* Quitamos el header de aquí para que no aparezca en el Login */}
        <Routes>
          {/* RUTA INICIAL: Si entras a "/", te manda a "/login" */}
          <Route path="/" element={<Navigate to="/login" />} />

          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas (solo entran si hay token) */}
          <Route 
            path="/alumno" 
            element={getToken() ? <DashboardAlumno /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/profesor" 
            element={getToken() ? <DashboardProfesor /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/admin" 
            element={getToken() ? <DashboardAdmin /> : <Navigate to="/login" />} 
          />

          {/* Si escriben cualquier otra cosa, al login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;