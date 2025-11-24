(async function () {
    console.log("Perfil component loaded");

    // Update user role display
    if (typeof window.updateUserRole === 'function') {
        window.updateUserRole();
    }

    const fullNameInput = document.getElementById('full-name');
    const emailInput = document.getElementById('email');
    const profileForm = document.querySelector('.profile-form');

    // Cargar datos del usuario
    try {
        // En una app real, esto vendría de un endpoint /users/me
        // Aquí simulamos usando los datos guardados en login o un mock
        const storedUser = JSON.parse(localStorage.getItem('user'));

        if (storedUser) {
            fullNameInput.value = storedUser.name || '';
            emailInput.value = storedUser.email || '';
        } else {
            // Fallback fetch si no hay nada en localstorage (o para refrescar)
            const userProfile = await window.api.get('/users/profile');
            if (userProfile) {
                fullNameInput.value = userProfile.name;
                emailInput.value = userProfile.email;
            }
        }
    } catch (error) {
        console.error("Error loading profile:", error);
    }

    if (profileForm) {
        // Remove old listeners
        const newForm = profileForm.cloneNode(true);
        profileForm.parentNode.replaceChild(newForm, profileForm);

        newForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const newName = document.getElementById('full-name').value;
            const newPassword = document.getElementById('password').value;
            const confirmPassword = document.getElementById('password-confirm').value;

            if (newPassword && newPassword !== confirmPassword) {
                alert("Las contraseñas no coinciden.");
                return;
            }

            try {
                const response = await window.api.put('/users/profile', {
                    name: newName,
                    password: newPassword
                });

                if (response.success) {
                    alert("Perfil actualizado correctamente.");
                    // Actualizar localstorage
                    const storedUser = JSON.parse(localStorage.getItem('user')) || {};
                    storedUser.name = newName;
                    localStorage.setItem('user', JSON.stringify(storedUser));
                } else {
                    alert("Error al actualizar el perfil.");
                }
            } catch (error) {
                console.error("Error updating profile:", error);
                alert("Hubo un problema al guardar los cambios.");
            }
        });

        // Botón Cerrar Sesión
        const logoutBtn = newForm.querySelector('.btn-danger');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (confirm("¿Cerrar sesión?")) {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('user');
                    window.location.href = '../../index.html'; // O recargar para mostrar login
                    // En este diseño SPA, tal vez queramos volver a una vista de login
                    // Pero como login.html es externo, esto está bien.
                    // Si login fuera un componente, haríamos loadView('login').
                    // Asumiremos que login es externo por ahora, o redirigimos a menuPrincipal y manejamos estado auth.
                    // Dado el flujo actual:
                    window.location.reload();
                }
            });
        }
    }

})();
