import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Para saltar de una página a otra
import { saveToken, saveRol } from '../servicios/Autenticacion';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Creamos el "navegador" interno

  const manejarEnvio = async (e) => {
    e.preventDefault();

    // 1. Conexión con el Backend
    try {
      const respuesta = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email: email, 
          password: password 
        })
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        // SI TODO VA BIEN:
        saveToken(datos.token); // Guardamos el JWT
        saveRol(datos.rol);     // Guardamos si es 'alumno', 'profesor' o 'admin'
        
        // 2. Redirección automática según el rol
        // Si el rol es 'alumno', navega a /alumno. Si es 'profesor', a /profesor...
        navigate('/' + datos.rol); 

      } else {
        alert("Error: " + datos.mensaje);
      }
    } catch (error) {
      // Si el backend no responde, simulamos para que puedas seguir trabajando
      console.log("Error de conexión. Usando modo simulación.");
      
      // BORRA ESTO cuando tus compañeros tengan el backend listo:
      saveToken("token_falso_prueba");
      saveRol("alumno"); // Prueba a cambiar esto por 'profesor' para ver si cambia la vista
      navigate('/alumno');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={manejarEnvio}>
        <div style={{ marginBottom: '10px' }}>
          <label>Email:</label><br />
          <input 
            type="email" 
            required
            style={{ width: '100%' }}
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label>Contraseña:</label><br />
          <input 
            type="password" 
            required
            style={{ width: '100%' }}
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#282c34', color: 'white', border: 'none', cursor: 'pointer' }}>
          Entrar
        </button>
      </form>
    </div>
  );
}

export default Login;