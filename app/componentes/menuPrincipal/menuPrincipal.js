(async function () {
    console.log("Menu Principal component loaded");

    // Update user role display using global function
    if (typeof window.updateUserRole === 'function') {
        window.updateUserRole();
    }

    // Card generation logic removed to use static HTML from reportes.html
    // This ensures menuPrincipal.html matches reportes.html exactly.

    // Initialize filters (similar to reportes.js)
    const filterPills = document.querySelectorAll(".pill");
    const reportCards = document.querySelectorAll(".report-card");

    filterPills.forEach(pill => {
        pill.addEventListener("click", () => {
            filterPills.forEach(p => p.classList.remove("active"));
            pill.classList.add("active");

            const filter = pill.innerText.split(" ")[0].toLowerCase();

            reportCards.forEach(card => {
                const cardStatus = card.className.split(" ").find(c => c.startsWith("status-"));
                const cardCategory = cardStatus ? cardStatus.replace("status-", "") : null;

                if (filter === "todos" || filter === cardCategory) {
                    card.style.display = "grid";
                } else {
                    card.style.display = "none";
                }
            });
        });
    });
})();
