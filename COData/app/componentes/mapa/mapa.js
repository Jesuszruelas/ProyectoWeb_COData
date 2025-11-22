(async function () {
    console.log("Mapa component loaded");

    const mapContainer = document.querySelector('.map-container');

    // Limpiar marcadores estáticos viejos si queremos redibujar
    // (En este HTML de ejemplo, los marcadores están hardcoded, así que los borramos)
    const staticMarkers = document.querySelectorAll('.map-marker');
    staticMarkers.forEach(m => m.remove());

    try {
        // Reutilizamos el endpoint de reportes, asumiendo que trae coordenadas
        const reports = await window.api.get('/reportes');

        if (reports && reports.length > 0) {
            // Actualizar contador en filtro "Todos"
            const allFilter = document.querySelector('.map-filters .pill.active .count');
            if (allFilter) allFilter.textContent = reports.length;

            reports.forEach((report, index) => {
                // Simular coordenadas dispersas para demo si no vienen en el reporte
                // En app real, usar report.latitude y report.longitude
                const top = 20 + (index * 15) % 60;
                const left = 20 + (index * 25) % 60;

                const marker = document.createElement('div');
                // Asignar clase según status o categoría
                let typeClass = 'marker-infra';
                let iconClass = 'fa-wrench';

                if (report.title.toLowerCase().includes('fuga')) {
                    typeClass = 'marker-services';
                    iconClass = 'fa-recycle';
                } else if (report.title.toLowerCase().includes('seguridad') || report.title.toLowerCase().includes('asalto')) {
                    typeClass = 'marker-security';
                    iconClass = 'fa-shield-halved';
                }

                marker.className = `map-marker ${typeClass}`;
                marker.style.top = `${top}%`;
                marker.style.left = `${left}%`;
                marker.title = `${report.title}`;
                marker.innerHTML = `<i class="fa-solid ${iconClass}"></i>`;

                marker.addEventListener('click', () => {
                    alert(`Reporte: ${report.title}\nEstado: ${report.status}\nFecha: ${report.date}`);
                });

                mapContainer.appendChild(marker);
            });
        }

    } catch (error) {
        console.error("Error loading map data:", error);
    }

    // Lógica de filtros (simple visual toggle)
    const filters = document.querySelectorAll('.map-filters .pill');
    filters.forEach(filter => {
        // Clone to remove old listeners
        const newFilter = filter.cloneNode(true);
        filter.parentNode.replaceChild(newFilter, filter);

        newFilter.addEventListener('click', () => {
            document.querySelectorAll('.map-filters .pill').forEach(p => p.classList.remove('active'));
            newFilter.classList.add('active');
            // Aquí se implementaría el filtrado real de marcadores
            console.log("Filtrando por:", newFilter.textContent.trim());
        });
    });

})();
