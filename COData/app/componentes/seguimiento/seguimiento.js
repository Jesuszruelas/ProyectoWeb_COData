// Espera a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {

    // Selecciona todos los íconos de "expandir/colapsar"
    const toggleIcons = document.querySelectorAll(".report-card-toggle-icon");

    toggleIcons.forEach(icon => {
        icon.addEventListener("click", () => {
            // Encuentra la tarjeta padre del ícono
            const card = icon.closest(".report-card");
            
            // Encuentra los detalles dentro de esa tarjeta
            const details = card.querySelector(".report-details");
            const meta = card.querySelector(".report-meta");
            const badge = card.querySelector(".report-status-badge");
            const actions = card.querySelector(".report-actions");

            // Si la tarjeta ya está expandida (mostrando detalles), la colapsamos
            if (card.classList.contains("expanded")) {
                card.classList.remove("expanded");
                icon.classList.remove("fa-chevron-up");
                icon.classList.add("fa-chevron-down");
                
                // Oculta los elementos
                if (details) details.style.display = "none";
                if (meta) meta.style.display = "none";
                if (badge) badge.style.display = "none";
                if (actions) actions.style.display = "none";

            } else {
                // Si la tarjeta está colapsada, la expandimos
                card.classList.add("expanded");
                icon.classList.remove("fa-chevron-down");
                icon.classList.add("fa-chevron-up");

                // Muestra los elementos
                // Usamos 'flex' o 'block' según corresponda al estilo CSS
                if (details) details.style.display = "block";
                if (meta) meta.style.display = "flex";
                if (badge) badge.style.display = "inline-block";
                if (actions) actions.style.display = "flex";
            }
        });
    });

    // Opcional: Colapsar todas las tarjetas que no estén "críticas" al inicio
    document.querySelectorAll(".report-card").forEach(card => {
        // Si la tarjeta NO tiene detalles (como las de "En Proceso"), no hagas nada
        if (!card.querySelector(".report-details")) {
            // Oculta el ícono si no hay nada que expandir
            const icon = card.querySelector(".report-card-toggle-icon");
            if(icon) icon.style.display = "none";
            return;
        }

        // Si la tarjeta SÍ tiene detalles, colápsala por defecto
        const icon = card.querySelector(".report-card-toggle-icon");
        if (icon) {
            // Simula un clic para colapsarla
            icon.click();
        }
    });

});