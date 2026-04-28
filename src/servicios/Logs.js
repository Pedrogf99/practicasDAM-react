export const registrarAccion = (mensaje) => {
  const logs = JSON.parse(localStorage.getItem('logs_sistema') || '[]');
  const nuevoLog = {
    id: Date.now(),
    fecha: new Date().toLocaleString(),
    usuario: localStorage.getItem('user_email'),
    accion: mensaje
  };
  localStorage.setItem('logs_sistema', JSON.stringify([nuevoLog, ...logs].slice(0, 50)));
};