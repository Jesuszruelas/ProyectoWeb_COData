const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
  container.classList.add('active');
});

loginBtn.addEventListener('click', (e) => {
  // Prevent default form submission if it's inside a form
  e.preventDefault();

  // Simulación de inicio de sesión exitoso
  // En una app real, aquí validarías las credenciales
  window.location.href = '../../index.html';
});