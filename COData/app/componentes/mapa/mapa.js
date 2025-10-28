// Espera a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {

    // Selecciona todos los botones de filtro ("pills") del mapa
    const filterPills = document.querySelectorAll(".pill");
    
    // Selecciona todos los marcadores del mapa
    const mapMarkers = document.querySelectorAll(".map-marker");

    // Añade un evento de clic a cada botón de filtro
    filterPills.forEach(pill => {
        pill.addEventListener("click", () => {
            
            // 1. Manejar el estado "active" de los botones
            filterPills.forEach(p => p.classList.remove("active"));
            pill.classList.add("active");

            // 2. Obtener el filtro seleccionado
            // Lee el texto del botón y lo convierte a minúsculas (ej: "todos", "seguridad")
            const filter = pill.innerText.split(" ")[0].toLowerCase();

            // 3. Filtrar los marcadores
            mapMarkers.forEach(marker => {
                // Obtiene la clase de categoría del marcador (ej: "marker-security")
                const markerClass = marker.className.split(" ").find(c => c.startsWith("marker-"));
                
                // Limpia el nombre de la clase (ej: "marker-security" -> "security")
                const markerCategory = markerClass ? markerClass.replace("marker-", "") : null;

                // 4. Mostrar u ocultar marcadores
                if (filter === "todos" || filter === markerCategory) {
                    marker.style.display = "flex"; // Muestra el marcador (usamos "flex" por el layout)
                } else {
                    marker.style.display = "none"; // Oculta el marcador
                }
            });
        });
    });

    // Opcional: Simular un clic en "Todos" al cargar la página
    if (filterPills.length > 0) {
        filterPills[0].click();
    }

    // Opcional: Añadir Tooltips a los marcadores (simulado)
    mapMarkers.forEach(marker => {
        marker.addEventListener("click", () => {
            const title = marker.getAttribute("title");
            if (title) {
                alert(`Reporte: ${title}`); // Usamos alert como simulación de un popup
            }
        });
    });

});

