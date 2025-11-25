
/**
 * Esta función se encarga de cargar las vistas (componentes) HTML
 * y sus archivos CSS correspondientes con animación iOS.
 */
function loadView(viewName) {
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;

  // Rutas relativas a index.html (que está en COData/app/)
  const htmlPath = `componentes/${viewName}/${viewName}.html`;
  const cssPath = `componentes/${viewName}/${viewName}.css`;
  const jsPath = `componentes/${viewName}/${viewName}.js`;

  loadComponentCSS(cssPath);

  // Trigger exit animation
  mainContent.style.animation = 'fadeSlideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards';

  // Wait for exit animation to complete
  setTimeout(() => {
    fetch(htmlPath)
      .then(response => {
        if (!response.ok) throw new Error(`El archivo ${htmlPath} no se encontró.`);
        return response.text();
      })
      .then(html => {
        mainContent.innerHTML = html;
        // Reset and trigger enter animation
        mainContent.style.animation = 'fadeSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        updateActiveNav(viewName);
        loadComponentJS(jsPath);
      })
      .catch(error => {
        console.error('Error al cargar la vista:', error);
        mainContent.innerHTML = `<p style="text-align: center; color: red;">Error: No se pudo cargar el componente ${viewName}.</p>`;
        mainContent.style.animation = 'fadeSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      });
  }, 300); // Match exit animation duration
}

function loadComponentJS(path) {
  const oldScript = document.getElementById('component-js');
  if (oldScript) oldScript.remove();

  const script = document.createElement('script');
  script.src = path;
  script.id = 'component-js';
  document.body.appendChild(script);
}

function updateActiveNav(viewName) {
  const navItems = document.querySelectorAll('.bottom-nav .nav-item');
  navItems.forEach(item => {
    item.classList.remove('active');
    const onclickAttr = item.getAttribute('onclick');
    if (onclickAttr && onclickAttr.includes(`'${viewName}'`)) {
      item.classList.add('active');
    }
  });
}

function loadComponentCSS(path) {
  let componentLink = document.getElementById('component-css');
  if (!componentLink) {
    componentLink = document.createElement('link');
    componentLink.id = 'component-css';
    componentLink.rel = 'stylesheet';
    document.head.appendChild(componentLink);
  }
  componentLink.href = path;
}

// Global function to update user role display in ALL component headers
window.updateUserRole = function () {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const roleElements = document.querySelectorAll('#menu-role-text, .role-text');

  roleElements.forEach(element => {
    if (element && user.email) {
      if (user.email === 'admin@cdata.com') {
        element.textContent = 'Admin';
      } else {
        element.textContent = 'User';
      }
    }
  });
};

// --- Authentication & Initialization ---

document.addEventListener('DOMContentLoaded', () => {
  const authContainer = document.getElementById('auth-container');
  const appContainer = document.getElementById('app-container');
  const loginToggle = document.getElementById('login-toggle');
  const registerToggle = document.getElementById('register-toggle');
  const container = document.getElementById('container');
  const logoutBtn = document.getElementById('logout-btn');

  // Check Auth State
  const token = localStorage.getItem('authToken');

  if (token) {
    showApp();
  } else {
    showLogin();
  }

  function showApp() {
    authContainer.classList.add('hidden-view');
    appContainer.classList.remove('hidden-view');

    // Update header with user role
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const adminTag = document.querySelector('.admin-tag');
    if (adminTag && user.email) {
      // Check if user is admin
      if (user.email === 'admin@cdata.com') {
        adminTag.textContent = 'Admin';
      } else {
        adminTag.textContent = 'User';
      }
    }

    loadView('menuPrincipal');
  }

  function showLogin() {
    appContainer.classList.add('hidden-view');
    authContainer.classList.remove('hidden-view');
  }

  // Toggle Login/Register Panels
  if (registerToggle) {
    registerToggle.addEventListener('click', () => {
      container.classList.add('active');
    });
  }

  if (loginToggle) {
    loginToggle.addEventListener('click', () => {
      container.classList.remove('active');
    });
  }

  // Handle Login
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;

      try {
        const response = await window.api.post('/auth/login', { email, password });

        if (response.token) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          showApp();
        } else {
          alert('Error al iniciar sesión: ' + (response.message || 'Credenciales inválidas'));
        }
      } catch (error) {
        console.error('Login error:', error);
        alert(error.message || 'Error de conexión');
      }
    });
  }

  // Handle Register
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('reg-name').value;
      const email = document.getElementById('reg-email').value;
      const password = document.getElementById('reg-password').value;

      try {
        const response = await window.api.post('/auth/register', { name, email, password });

        if (response.success) {
          alert('Registro exitoso. Por favor, inicia sesión.');
          container.classList.remove('active'); // Switch to login view
        } else {
          alert(response.message || 'Error al registrarse');
        }
      } catch (error) {
        console.error('Register error:', error);
        alert('Error al intentar registrarse');
      }
    });
  }

  // Handle Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm("¿Cerrar sesión?")) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        showLogin();
      }
    });
  }
});