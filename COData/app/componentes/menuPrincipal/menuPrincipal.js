(async function () {
    console.log("MenuPrincipal component loaded");

    // Ejemplo: Cargar estadísticas del dashboard
    try {
        // Simulamos llamada a endpoint de stats
        const stats = await window.api.get('/stats');

        // Si tuviéramos elementos en el DOM para mostrar estos números, los actualizaríamos aquí
        // Por ejemplo:
        // document.getElementById('total-reports').textContent = stats.total;

        console.log("Dashboard stats loaded:", stats);

    } catch (error) {
        console.error("Error loading dashboard stats:", error);
    }

    // Re-attach event listeners for "Seleccionar" buttons if needed
    // (Though inline onclick="loadView('registro')" in HTML handles navigation nicely)

    // Example: Add animation or extra logic to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;
    });

    // Add keyframes for fadeIn if not present
    if (!document.getElementById('dynamic-styles')) {
        const style = document.createElement('style');
        style.id = 'dynamic-styles';
        style.innerHTML = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }

})();
