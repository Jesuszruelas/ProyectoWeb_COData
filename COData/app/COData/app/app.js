/**
 * Esta función se encarga de cargar las vistas (componentes) HTML
 * y sus archivos CSS correspondientes.
 */
function loadView(viewName) {
  // 1. Busca el contenedor principal en index.html
  const mainContent = document.getElementById('main-content');

  // Si no lo encuentra, detiene todo para evitar errores
  if (!mainContent) {
    console.error("Error: No se encontró el elemento #main-content.");
    return;
  }

  // 2. Define las rutas para HTML y CSS
  const htmlPath = `COData/app/componentes/${viewName}/${viewName}.html`;
  const cssPath = `COData/app/componentes/${viewName}/${viewName}.css`;

  // 3. Llama a la función para cargar el CSS específico
  loadComponentCSS(cssPath);

  // 4. Carga el HTML del componente
  fetch(htmlPath)
    .then(response => {
      // Si no encuentra el archivo .html, muestra un error
      if (!response.ok) {
        throw new Error(`El archivo ${htmlPath} no se encontró.`);
      }
      return response.text();
    })
    .then(html => {
      // 5. Inyecta el HTML traído dentro del <main>
      mainContent.innerHTML = html;
    })
    .catch(error => {
      // Si hay un error, lo muestra en la consola y en la página
      console.error('Error al cargar la vista:', error);
      mainContent.innerHTML = `<p style="text-align: center; color: red;">Error: No se pudo cargar el componente ${viewName}.</p>`;
    });
}

/**
 * Esta función carga la hoja de estilos (CSS) de un componente
 * en el <head> de la página.
 */
function loadComponentCSS(path) {
  // 1. Busca si ya tenemos una etiqueta <link> para componentes
  let componentLink = document.getElementById('component-css');

  // 2. Si no existe, la crea por primera vez y la añade al <head>
  if (!componentLink) {
    componentLink = document.createElement('link');
    componentLink.id = 'component-css';
    componentLink.rel = 'stylesheet';
    document.head.appendChild(componentLink);
  }

  // 3. Actualiza el 'href' a la ruta del nuevo archivo CSS
  componentLink.href = path;
}

// --- Carga inicial ---
// Esto se ejecuta cuando el navegador termina de cargar el HTML.
document.addEventListener('DOMContentLoaded', () => {
  // Le decimos que cargue la vista 'seguimiento' por defecto
  loadView('seguimiento');
});