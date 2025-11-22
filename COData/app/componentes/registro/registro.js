// Espera a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {

    // Selecciona el formulario de reporte
    const reportForm = document.querySelector(".report-form");

    if (reportForm) {
        reportForm.addEventListener("submit", (event) => {
            // Previene que el formulario se envíe de la forma tradicional
            event.preventDefault();

            // Aquí iría la lógica para recolectar los datos del formulario
            const title = document.getElementById("report-title").value;
            const description = document.getElementById("report-description").value;
            const location = document.getElementById("report-location").value;

            // Validación simple (solo para demostración)
            if (!title || !description || !location) {
                alert("Por favor, completa todos los campos (Título, Descripción y Ubicación).");
                return;
            }

            // Simulación de envío exitoso
            console.log("Enviando reporte:", { title, description, location });

            // Mostrar un mensaje al usuario
            alert("¡Reporte enviado exitosamente!");

            // Limpiar el formulario
            reportForm.reset();

            // Opcional: Redirigir al usuario a la página de seguimiento
            if (typeof loadView === 'function') {
                loadView('seguimiento');
            } else {
                console.warn('loadView no está definida. Redirigiendo manualmente...');
                // Fallback si loadView no está disponible (aunque debería estarlo en index.html)
                // window.location.href = "seguimiento.html"; // Esto ya no es válido en SPA
            }
        });
    }

    // Lógica para el botón "Usar mi ubicación" (simulado)
    const locationBtn = document.querySelector(".btn-location");
    if (locationBtn) {
        locationBtn.addEventListener("click", () => {
            // Simulación de geolocalización
            const locationInput = document.getElementById("report-location");
            locationInput.value = "Ubicación simulada: Calle Falsa 123";

            // En una app real, usarías:
            // navigator.geolocation.getCurrentPosition(success, error);
        });
    }

    // Lógica para los botones de evidencia (simulado)
    const evidenceButtons = document.querySelectorAll(".btn-evidence");
    evidenceButtons.forEach(button => {
        button.addEventListener("click", () => {
            const type = button.innerText.includes("Foto") ? "foto" : "video";
            alert(`Simulación: Abriendo cámara para tomar ${type}...`);

            // Aquí se podría mostrar la previsualización
            const preview = document.querySelector(".evidence-preview");
            if (preview) {
                preview.style.display = "block";
                preview.innerHTML += `<p>Evidencia (${type}) adjuntada: ${type}_ejemplo.jpg</p>`;
            }
        });
    });

});

