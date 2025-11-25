// Espera a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    
    // Selecciona todos los botones de filtro ("pills")
    const filterPills = document.querySelectorAll(".pill");
    
    // Selecciona todas las tarjetas de reporte
    const reportCards = document.querySelectorAll(".report-card");

    // Añade un evento de clic a cada botón de filtro
    filterPills.forEach(pill => {
        pill.addEventListener("click", () => {
            
            // 1. Manejar el estado "active" de los botones
            // Quita la clase "active" de todos los botones
            filterPills.forEach(p => p.classList.remove("active"));
            // Añade la clase "active" solo al botón clickeado
            pill.classList.add("active");

            // 2. Obtener el filtro seleccionado
            // Lee el texto del botón y lo convierte a minúsculas (ej: "todos", "seguridad")
            const filter = pill.innerText.split(" ")[0].toLowerCase();

            // 3. Filtrar las tarjetas
            reportCards.forEach(card => {
                // Obtiene la clase de estado de la tarjeta (ej: "status-security")
                const cardStatus = card.className.split(" ").find(c => c.startsWith("status-"));
                
                // Limpia el nombre de la clase (ej: "status-security" -> "security")
                const cardCategory = cardStatus ? cardStatus.replace("status-", "") : null;

                // 4. Mostrar u ocultar tarjetas
                if (filter === "todos" || filter === cardCategory) {
                    card.style.display = "grid"; // Muestra la tarjeta (usamos "grid" por el layout)
                } else {
                    card.style.display = "none"; // Oculta la tarjeta
                }
            });
        });
    });

    // Opcional: Simular un clic en "Todos" al cargar la página para asegurar estado inicial
    if (filterPills.length > 0) {
        filterPills[0].click();
    }
});

