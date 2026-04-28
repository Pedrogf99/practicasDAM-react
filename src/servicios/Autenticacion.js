export const saveRol = (rol) => {
  localStorage.setItem('user_rol', rol);
};

export const getRol = () => {
  return localStorage.getItem('user_rol');
};

export const removeRol = () => {
  localStorage.removeItem('user_rol');
};