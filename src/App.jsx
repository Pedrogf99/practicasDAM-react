import { useState } from 'react';
import './App.css';
import Login from './vistas/Login';
import DashboardAlumno from './componentes/DashboardAlumno';

function App() {
  // 1. Esta es la "llave" que dice si el alumno ha entrado o no
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="App">
      <header style={{ padding: '20px', textAlign: 'center', backgroundColor: '#282c34', color: 'white' }}>
        <h1>Gestor FFEOE - Proyecto Pedro</h1>
      </header>

      <main style={{ padding: '20px' }}>
        {/* Lógica condicional: */}
        {!isLoggedIn ? (
          /* Si NO está logueado, le enseñamos el Login */
          <Login onLoginSuccess={() => setIsLoggedIn(true)} />
        ) : (
          /* Si YA está logueado, le enseñamos su Dashboard y el botón de salir */
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <h2>Bienvenido, Alumno</h2>
               <button onClick={() => setIsLoggedIn(false)} style={{ backgroundColor: 'red', color: 'white' }}>
                 Cerrar Sesión
               </button>
            </div>
            
            <DashboardAlumno />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;