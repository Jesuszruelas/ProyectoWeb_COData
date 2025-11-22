(async function () {
    console.log("Seguimiento component loaded");

    const container = document.querySelector('.main-content');
    // Mantener el título y filtros, limpiar las tarjetas viejas
    // En una implementación más robusta, tendríamos un contenedor específico para la lista

    // Para simplificar, buscaremos las tarjetas existentes y las eliminaremos antes de cargar las nuevas
    const existingCards = document.querySelectorAll('.report-card');
    existingCards.forEach(card => card.remove());

    // Contenedor para inyectar las nuevas tarjetas
    // Insertamos después del filter-container
    const filterContainer = document.querySelector('.filter-container');
    let listContainer = document.getElementById('report-list-container');

    if (!listContainer) {
        listContainer = document.createElement('div');
        listContainer.id = 'report-list-container';
        if (filterContainer) {
            filterContainer.insertAdjacentElement('afterend', listContainer);
        } else {
            container.appendChild(listContainer);
        }
    } else {
        listContainer.innerHTML = ''; // Limpiar si ya existe
    }

    try {
        const reports = await window.api.get('/reportes');

        if (reports && reports.length > 0) {
            // Actualizar contador
            const countElement = document.querySelector('.filter-container p');
            if (countElement) countElement.textContent = `${reports.length} reportes encontrados`;

            reports.forEach(report => {
                const card = createReportCard(report);
                listContainer.appendChild(card);
            });
        } else {
            listContainer.innerHTML = '<p style="text-align:center; margin-top: 20px;">No hay reportes registrados.</p>';
        }

    } catch (error) {
        console.error("Error fetching reports:", error);
        listContainer.innerHTML = '<p style="text-align:center; color: red;">Error al cargar los reportes.</p>';
    }

    function createReportCard(report) {
        const card = document.createElement('div');
        card.className = `card report-card status-${report.status || 'pending'}`;

        let statusColor = 'warning';
        let statusText = 'Pendiente';

        if (report.status === 'critical') {
            statusColor = 'danger';
            statusText = 'Crítico';
        } else if (report.status === 'completed') {
            statusColor = 'success';
            statusText = 'Completado';
        }

        card.innerHTML = `
            <div class="report-card-header">
                <span class="report-id">RPT-${String(report.id).padStart(3, '0')}</span>
                <i class="report-status-dot dot-${statusColor}"></i>
            </div>
            <h3 class="report-title">${report.title}</h3>

            <div class="report-meta">
                <span><i class="fa-regular fa-calendar"></i> ${report.date || 'N/A'}</span>
                <span><i class="fa-regular fa-user"></i> Usuario</span>
            </div>
            <span class="report-status-badge">${statusText}</span>

            <div class="report-details">
                <p><strong>Descripción:</strong> ${report.description || 'Sin descripción'}</p>
                <p><strong>Ubicación:</strong> ${report.location || 'No especificada'}</p>
            </div>

            <div class="report-actions">
                <button class="btn btn-primary" onclick="alert('Actualizar reporte ${report.id}')">Actualizar</button>
                <button class="btn btn-danger delete-btn" data-id="${report.id}">Eliminar</button>
            </div>
        `;

        // Add event listener for delete button
        const deleteBtn = card.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', async () => {
            if (confirm('¿Estás seguro de eliminar este reporte?')) {
                try {
                    await window.api.delete(`/reportes/${report.id}`);
                    card.remove();
                    alert('Reporte eliminado');
                } catch (error) {
                    console.error('Error deleting report:', error);
                    alert('Error al eliminar');
                }
            }
        });

        return card;
    }

})();