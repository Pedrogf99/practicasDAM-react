export const saveToken = (token) => localStorage.setItem('token_gestor', token);
export const getToken = () => localStorage.getItem('token_gestor');
export const saveRol = (rol) => localStorage.setItem('user_rol', rol);
export const getRol = () => localStorage.getItem('user_rol');