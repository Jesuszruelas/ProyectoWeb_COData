const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

// Toggle between login and register panels
registerBtn.addEventListener('click', () => {
  container.classList.add('active');
});

loginBtn.addEventListener('click', () => {
  container.classList.remove('active');
});

// Handle Login Form Submission
const loginForm = document.querySelector('.sign-in form');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm.querySelector('input[type="email"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;

    try {
      // Use the global api instance (exposed in api.js)
      // In a real module system, you would import it
      const response = await window.api.post('/auth/login', { email, password });

      if (response.token) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        alert(`Bienvenido, ${response.user.name}`);
        window.location.href = '../../index.html';
      } else {
        alert('Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Error de conexión o credenciales inválidas');
    }
  });
}

// Handle Register Form Submission
const registerForm = document.querySelector('.sign-up form');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = registerForm.querySelector('input[type="text"]').value;
    const email = registerForm.querySelector('input[type="email"]').value;
    const password = registerForm.querySelector('input[type="password"]').value;

    try {
      const response = await window.api.post('/auth/register', { name, email, password });

      if (response.success) {
        alert('Registro exitoso. Por favor, inicia sesión.');
        container.classList.remove('active'); // Switch to login view
      } else {
        alert('Error al registrarse');
      }
    } catch (error) {
      console.error('Register error:', error);
      alert('Error al intentar registrarse');
    }
  });
}