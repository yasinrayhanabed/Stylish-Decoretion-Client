export function saveAuth(token, user){
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}
export function logout(){
  localStorage.removeItem('token'); localStorage.removeItem('user');
  window.location.href = '/login';
}
export function getUser(){
  const u = localStorage.getItem('user');
  return u ? JSON.parse(u) : null;
}
