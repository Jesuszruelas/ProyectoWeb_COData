(async function () {
    console.log("Notificaciones component loaded");

    // Update user role display
    if (typeof window.updateUserRole === 'function') {
        window.updateUserRole();
    }

    const listContainer = document.querySelector('.notifications-list');

    try {
        // Simulamos una llamada a la API para obtener notificaciones
        // En una app real: const notifications = await window.api.get('/notifications');

        // Mock data
        const notifications = [
            {
                id: 1,
                type: 'success',
                title: 'Reporte Resuelto',
                message: 'Tu reporte #003 sobre "Baches reparados" ha sido marcado como completado.',
                time: 'Hace 2 horas',
                read: false
            },
            {
                id: 2,
                type: 'info',
                title: 'Nuevo Comentario',
                message: 'El administrador ha comentado en tu reporte #001.',
                time: 'Hace 1 día',
                read: true
            },
            {
                id: 3,
                type: 'warning',
                title: 'Mantenimiento Programado',
                message: 'El sistema estará en mantenimiento este fin de semana.',
                time: 'Hace 2 días',
                read: true
            }
        ];

        if (listContainer) {
            listContainer.innerHTML = ''; // Limpiar loading

            if (notifications.length > 0) {
                notifications.forEach(notif => {
                    const card = document.createElement('div');
                    card.className = `notification-card ${notif.read ? '' : 'notification-unread'}`;

                    let iconClass = 'fa-info';
                    let bgClass = 'icon-info';

                    if (notif.type === 'success') { iconClass = 'fa-check'; bgClass = 'icon-success'; }
                    if (notif.type === 'warning') { iconClass = 'fa-triangle-exclamation'; bgClass = 'icon-warning'; }
                    if (notif.type === 'danger') { iconClass = 'fa-circle-exclamation'; bgClass = 'icon-danger'; }

                    card.innerHTML = `
                        <div class="notification-icon ${bgClass}">
                            <i class="fa-solid ${iconClass}"></i>
                        </div>
                        <div class="notification-content">
                            <div class="notification-title">${notif.title}</div>
                            <div class="notification-message">${notif.message}</div>
                            <div class="notification-time">${notif.time}</div>
                        </div>
                    `;

                    listContainer.appendChild(card);
                });
            } else {
                listContainer.innerHTML = '<p style="text-align:center; padding: 20px;">No tienes notificaciones nuevas.</p>';
            }
        }

    } catch (error) {
        console.error("Error loading notifications:", error);
        if (listContainer) listContainer.innerHTML = '<p style="text-align:center; color: red;">Error al cargar notificaciones.</p>';
    }

})();
