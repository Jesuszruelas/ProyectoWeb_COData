// Espera a que el DOM esté completamente cargado
// Nota: En la arquitectura actual, este script se carga dinámicamente,
// por lo que el evento DOMContentLoaded ya ocurrió. Ejecutamos directamente.

(function () {
    console.log("Registro component loaded");

    // Selecciona el formulario de reporte
    const reportForm = document.querySelector(".report-form");

    if (reportForm) {
        // Remove existing listeners to avoid duplicates if reloaded
        const newForm = reportForm.cloneNode(true);
        reportForm.parentNode.replaceChild(newForm, reportForm);

        newForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const title = document.getElementById("report-title").value;
            const description = document.getElementById("report-description").value;
            const location = document.getElementById("report-location").value;

            if (!title || !description || !location) {
                alert("Por favor, completa todos los campos (Título, Descripción y Ubicación).");
                return;
            }

            try {
                const response = await window.api.post('/reportes', {
                    title,
                    description,
                    location,
                    date: new Date().toISOString()
                });

                if (response.success) {
                    alert("¡Reporte enviado exitosamente!");
                    newForm.reset();

                    if (typeof loadView === 'function') {
                        loadView('seguimiento');
                    }
                } else {
                    alert("Error al enviar el reporte.");
                }
            } catch (error) {
                console.error("Error submitting report:", error);
                alert("Hubo un problema al enviar el reporte.");
            }
        });
    }

    // Lógica para el botón "Usar mi ubicación"
    const locationBtn = document.querySelector(".btn-location");
    if (locationBtn) {
        // Clone to remove listeners
        const newBtn = locationBtn.cloneNode(true);
        locationBtn.parentNode.replaceChild(newBtn, locationBtn);

        newBtn.addEventListener("click", () => {
            const locationInput = document.getElementById("report-location");
            locationInput.value = "Cargando ubicación...";

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        locationInput.value = `${latitude}, ${longitude}`;
                    },
                    (error) => {
                        console.error("Geolocation error:", error);
                        locationInput.value = "Ubicación simulada: Calle Falsa 123";
                        alert("No se pudo obtener la ubicación real. Usando simulada.");
                    }
                );
            } else {
                locationInput.value = "Ubicación simulada: Calle Falsa 123";
            }
        });
    }

    // Logic for "Seleccionar en Mapa" button
    const mapSelectBtn = document.querySelector(".btn-map-select");
    if (mapSelectBtn) {
        const newMapBtn = mapSelectBtn.cloneNode(true);
        mapSelectBtn.parentNode.replaceChild(newMapBtn, mapSelectBtn);

        newMapBtn.addEventListener("click", () => {
            // Save current form state to localStorage so we don't lose it
            const title = document.getElementById("report-title").value;
            const description = document.getElementById("report-description").value;

            localStorage.setItem('tempReportData', JSON.stringify({ title, description }));
            localStorage.setItem('selectingLocation', 'true');

            // Redirect to map
            if (typeof loadView === 'function') {
                loadView('mapa');
            }
        });
    }

    // Check if we are returning from map selection
    const selectedLocation = localStorage.getItem('selectedLocation');
    if (selectedLocation) {
        const locationInput = document.getElementById("report-location");
        if (locationInput) {
            locationInput.value = selectedLocation;
        }

        // Restore other form data
        const tempData = localStorage.getItem('tempReportData');
        if (tempData) {
            const { title, description } = JSON.parse(tempData);
            document.getElementById("report-title").value = title || '';
            document.getElementById("report-description").value = description || '';

            // Clear temp data
            localStorage.removeItem('tempReportData');
        }

        // Clear selection flag
        localStorage.removeItem('selectedLocation');
    }

    // Lógica para los botones de evidencia
    const evidenceButtons = document.querySelectorAll(".btn-evidence");
    evidenceButtons.forEach(button => {
        // Clone to remove listeners
        const newBtn = button.cloneNode(true);
        button.parentNode.replaceChild(newBtn, button);

        newBtn.addEventListener("click", () => {
            const type = newBtn.innerText.includes("Foto") ? "foto" : "video";
            alert(`Simulación: Abriendo cámara para tomar ${type}...`);

            const preview = document.querySelector(".evidence-preview");
            if (preview) {
                preview.style.display = "block";
                preview.innerHTML += `<p>Evidencia (${type}) adjuntada: ${type}_ejemplo.jpg</p>`;
            }
        });
    });

})();
