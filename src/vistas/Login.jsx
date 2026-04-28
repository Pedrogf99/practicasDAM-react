import { useState } from 'react';
import { saveToken } from '../servicios/Autenticacion';

function Login(props) {
  // Creamos las "cajas" para guardar el email y la contraseña
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const manejarEnvio = (e) => {
    e.preventDefault();    
    props.onLoginSuccess();// Evita que la página se recargue sola
    
    // De momento, como no hay Backend, simulamos que todo va bien
    console.log("Enviando datos:", email, password);
    
    const tokenFalso = "12345_token_de_prueba"; 
    saveToken(tokenFalso); // Guardamos el "sello" en tu billetera (authService)
    
    alert("¡Has iniciado sesión! El token se ha guardado.");
  };

  return (
    <div style={{ padding: '20px', border: '1px solid black' }}>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={manejarEnvio}>
        <input 
          type="email" 
          placeholder="Tu correo" 
          onChange={(e) => setEmail(e.target.value)} // Cada vez que escribes, se guarda en la "caja" email
        />
        <br /><br />
        <input 
          type="password" 
          placeholder="Tu contraseña" 
          onChange={(e) => setPassword(e.target.value)} // Se guarda en la "caja" password
        />
        <br /><br />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default Login;
const manejarEnvio = async (e) => {
    e.preventDefault();

    // 1. "Llamamos" al Backend por teléfono (la URL)
    // Cambia 'http://localhost:3000/login' por la dirección que te dé tu compañero
    try {
      const respuesta = await fetch('http://localhost:3000/login', {
        method: 'POST', // Decimos que vamos a ENVIAR datos
        headers: {
          'Content-Type': 'application/json' // Decimos que hablamos en idioma JSON
        },
        body: JSON.stringify({ 
          email: email, 
          password: password 
        }) // Metemos el email y la clave en el sobre
      });

      // 2. Esperamos a que el Backend nos conteste
      const datos = await respuesta.json();

      if (respuesta.ok) {
        // SI TODO HA IDO BIEN:
        saveToken(datos.token); // Guardamos el Ticket Dorado real
        props.onLoginSuccess(); // Cambiamos a la pantalla de Dashboard
      } else {
        // SI EL BACKEND DICE QUE NO:
        alert("Error: " + datos.mensaje); // "Usuario no encontrado" o "Clave mal"
      }
    } catch (error) {
      // SI EL BACKEND ESTÁ APAGADO:
      alert("No puedo conectar con el servidor. ¿Está encendido?");
    }
  };