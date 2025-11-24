(async function () {
    console.log("Seguimiento component loaded");

    // Update user role display
    if (typeof window.updateUserRole === 'function') {
        window.updateUserRole();
    }

    const mainContent = document.querySelector('.main-content');
    const filterContainer = document.querySelector('.filter-container');

    // Create container for cards if it doesn't exist
    let cardsContainer = document.getElementById('reports-cards-container');
    if (!cardsContainer) {
        cardsContainer = document.createElement('div');
        cardsContainer.id = 'reports-cards-container';
        cardsContainer.className = 'reports-grid';

        // Remove existing static cards
        const existingCards = document.querySelectorAll('.report-card');
        existingCards.forEach(card => card.remove());

        if (filterContainer) {
            filterContainer.insertAdjacentElement('afterend', cardsContainer);
        } else {
            mainContent.appendChild(cardsContainer);
        }
    } else {
        cardsContainer.innerHTML = '';
    }

    try {
        const reports = await window.api.get('/reportes');

        if (reports && reports.length > 0) {
            // Update counter
            const countElement = document.querySelector('.filter-container p');
            if (countElement) countElement.textContent = `${reports.length} reportes encontrados`;

            reports.forEach(report => {
                const card = createReportCard(report);
                cardsContainer.appendChild(card);
            });
        } else {
            cardsContainer.innerHTML = '<p style="text-align:center; margin-top: 20px; grid-column: 1/-1;">No hay reportes registrados.</p>';
        }

    } catch (error) {
        console.error("Error fetching reports:", error);
        cardsContainer.innerHTML = '<p style="text-align:center; color: red; grid-column: 1/-1;">Error al cargar los reportes.</p>';
    }

    function createReportCard(report) {
        const card = document.createElement('div');
        let statusClass = 'status-pending';
        let statusColor = 'warning';
        let statusText = 'Pendiente';
        let statusBadgeClass = 'badge-warning';

        if (report.status === 'critical') {
            statusClass = 'status-critical';
            statusColor = 'danger';
            statusText = 'Crítico';
            statusBadgeClass = 'badge-danger';
        } else if (report.status === 'completed') {
            statusClass = 'status-completed';
            statusColor = 'success';
            statusText = 'Completado';
            statusBadgeClass = 'badge-success';
        }

        card.className = `card report-card ${statusClass}`;

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
            <span class="report-status-badge ${statusBadgeClass}">${statusText}</span>

            <div class="report-details">
                <p><strong>Descripción:</strong> ${report.description || 'Sin descripción'}</p>
                <p><strong>Ubicación:</strong> ${report.location || 'No especificada'}</p>
            </div>

            <div class="report-actions">
                <button class="btn btn-update update-btn" data-id="${report.id}">
                    <i class="fa-solid fa-pen"></i> Actualizar
                </button>
                <button class="btn btn-delete delete-btn" data-id="${report.id}">
                    <i class="fa-solid fa-trash"></i> Eliminar
                </button>
            </div>
        `;

        // Add event listener for delete button
        const deleteBtn = card.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', async () => {
            if (confirm('¿Estás seguro de eliminar este reporte?')) {
                try {
                    await window.api.delete(`/reportes/${report.id}`);
                    card.remove();

                    // Update counter
                    const remaining = cardsContainer.querySelectorAll('.report-card').length;
                    const countElement = document.querySelector('.filter-container p');
                    if (countElement) countElement.textContent = `${remaining} reportes encontrados`;

                    alert('Reporte eliminado exitosamente');
                } catch (error) {
                    console.error('Error deleting report:', error);
                    alert('Error al eliminar el reporte');
                }
            }
        });

        // Add event listener for update button
        const updateBtn = card.querySelector('.update-btn');
        updateBtn.addEventListener('click', async () => {
            const newStatus = prompt("Nuevo estado (pending, critical, completed):", report.status);
            if (newStatus && ['pending', 'critical', 'completed'].includes(newStatus)) {
                try {
                    const updatedReport = await window.api.put(`/reportes/${report.id}`, { ...report, status: newStatus });
                    alert('Reporte actualizado correctamente');
                    // Refresh view (simple way)
                    if (typeof loadView === 'function') {
                        loadView('seguimiento');
                    } else {
                        // Or just reload page if loadView is not available globally in this context
                        window.location.reload();
                    }
                } catch (error) {
                    console.error('Error updating report:', error);
                    alert('Error al actualizar el reporte');
                }
            } else if (newStatus) {
                alert("Estado inválido. Use: pending, critical, o completed");
            }
        });

        return card;
    }

})();