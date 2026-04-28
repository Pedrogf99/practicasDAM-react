import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./vistas/Login.jsx";
import DashboardAlumno from "./vistas/DashboardAlumno.jsx";
import DashboardProfesor from "./vistas/DashboardProfesor.jsx";
import DashboardAdmin from "./vistas/DashboardAdmin.jsx";
import DashboardEmpresa from "./vistas/DashboardEmpresa.jsx"; // Nombre ajustado
import { getToken } from './servicios/Autenticacion';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirigir raíz al Login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Ruta de Login */}
        <Route path="/login" element={<Login />} />

        {/* Rutas Protegidas */}
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

        {/* Ruta para la gestión de datos legales, responsables y tutores */}
        <Route 
          path="/empresa" 
          element={getToken() ? <DashboardEmpresa /> : <Navigate to="/login" />} 
        />

        {/* Captura de errores */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;