(async function () {
    console.log("Notificaciones component loaded");

    // Update user role display
    if (typeof window.updateUserRole === 'function') {
        window.updateUserRole();
    }

    const listContainer = document.querySelector('.notifications-list');

    try {
        const notifications = await window.api.get('/notifications');

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

                    // Format date
                    const date = new Date(notif.date);
                    const timeString = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

                    card.innerHTML = `
                        <div class="notification-icon ${bgClass}">
                            <i class="fa-solid ${iconClass}"></i>
                        </div>
                        <div class="notification-content">
                            <div class="notification-title">${notif.title}</div>
                            <div class="notification-message">${notif.message}</div>
                            <div class="notification-time">${timeString}</div>
                        </div>
                    `;

                    // Mark as read on click
                    if (!notif.read) {
                        card.addEventListener('click', async () => {
                            try {
                                await window.api.put(`/notifications/${notif.id}/read`, {});
                                card.classList.remove('notification-unread');
                            } catch (error) {
                                console.error('Error marking as read:', error);
                            }
                        });
                    }

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
