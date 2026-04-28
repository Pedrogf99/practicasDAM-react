export const saveToken = (token) => {
  localStorage.setItem('token_gestor', token);
};

export const getToken = () => {
  return localStorage.getItem('token_gestor');
};

export const removeToken = () => {
  localStorage.removeItem('token_gestor');
};