(async function () {
    console.log("Menu Principal component loaded");

    // Update user role display using global function
    if (typeof window.updateUserRole === 'function') {
        window.updateUserRole();
    }

    const container = document.getElementById('report-types-container');

    if (!container) {
        console.error("Container not found");
        return;
    }

    // Define report types
    const reportTypes = [
        {
            id: 1,
            title: "Seguridad Pública",
            description: "Incidentes de seguridad, robos, violencia",
            icon: "fa-shield-halved",
            status: "security",
            category: "Seguridad"
        },
        {
            id: 2,
            title: "Vialidad y Tránsito",
            description: "Accidentes, infracciones de tránsito, vialidades",
            icon: "fa-car",
            status: "transit",
            category: "Vialidad"
        },
        {
            id: 3,
            title: "Infraestructura Urbana",
            description: "Daños en calles, alumbrado, señalización",
            icon: "fa-road",
            status: "infrastructure",
            category: "Infraestructura"
        },
        {
            id: 4,
            title: "Servicios Públicos",
            description: "Agua, electricidad, recolección de basura",
            icon: "fa-recycle",
            status: "services",
            category: "Servicios"
        },
        {
            id: 5,
            title: "Emergencias",
            description: "Situaciones que requieren atención inmediata",
            icon: "fa-triangle-exclamation",
            status: "emergency",
            category: "Emergencias"
        }
    ];

    // Clear container
    container.innerHTML = '';

    // Generate cards
    reportTypes.forEach(type => {
        const card = createReportTypeCard(type);
        container.appendChild(card);
    });

    function createReportTypeCard(type) {
        const card = document.createElement('div');
        card.className = `report-card status-${type.status}`;

        card.innerHTML = `
            <div class="card-icon">
                <i class="fa-solid ${type.icon}"></i>
            </div>
            <div class="card-content">
                <h3>${type.title}</h3>
                <p>${type.description}</p>
                <div class="card-evidence">
                    <i class="fa-solid fa-camera"></i> Foto
                    <i class="fa-solid fa-video"></i> Video
                </div>
            </div>
            <div class="card-action">
                <a href="#" class="btn-select">Seleccionar <i class="fa-solid fa-chevron-right"></i></a>
            </div>
        `;

        // Add click event to the select button
        const selectBtn = card.querySelector('.btn-select');
        selectBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loadView('registro');
        });

        return card;
    }

    // Add animation on load
    const cards = container.querySelectorAll('.report-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });

})();
