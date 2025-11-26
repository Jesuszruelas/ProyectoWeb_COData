(function () {
    const avatarInput = document.getElementById('avatar-upload');
    const profileAvatar = document.querySelector('.profile-avatar');
    const fullNameInput = document.getElementById('full-name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const passwordConfirmInput = document.getElementById('password-confirm');
    const profileForm = document.querySelector('.profile-form');

    // Helper to generate default avatar
    const getDefaultAvatar = (name) => {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128`;
    };

    // Load user data
    let user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        // Redirect to login if no user found
        alert('Debes iniciar sesión para ver tu perfil.');
        // Assuming there is a way to trigger logout/login view from here, 
        // or just reload which will trigger the auth check in index.html
        window.location.reload();
        return;
    }

    if (user) {
        fullNameInput.value = user.name || '';
        emailInput.value = user.email || '';
        if (user.profilePicture) {
            profileAvatar.src = user.profilePicture;
        } else {
            profileAvatar.src = getDefaultAvatar(user.name || 'User');
        }

        const roleBadge = document.getElementById('user-role-badge');
        if (roleBadge) {
            // Capitalize first letter
            const roleName = user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User';
            roleBadge.innerHTML = `<i class="fa-solid fa-user-shield"></i> ${roleName}`;
        }
    }

    // Handle file selection
    avatarInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const result = await window.api.uploadProfilePicture(file);
            if (result.success) {
                // Update image source
                profileAvatar.src = result.imageUrl;

                // Update local storage
                user.profilePicture = result.imageUrl;
                localStorage.setItem('user', JSON.stringify(user));

                alert('Foto de perfil actualizada correctamente');
            }
        } catch (error) {
            console.error(error);
            alert('Error al subir la imagen: ' + error.message);
        }
    });

    // Handle form submission
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = fullNameInput.value.trim();
        const password = passwordInput.value;
        const passwordConfirm = passwordConfirmInput.value;

        if (!name) {
            alert('El nombre no puede estar vacío');
            return;
        }

        if (password && password !== passwordConfirm) {
            alert('Las contraseñas no coinciden');
            return;
        }

        const updateData = { name };
        if (password) {
            updateData.password = password;
        }

        try {
            const result = await window.api.updateProfile(updateData);
            if (result.success) {
                // Update local storage
                user = { ...user, ...result.user };
                localStorage.setItem('user', JSON.stringify(user));

                // Update UI if name changed (affects default avatar if no picture)
                if (!user.profilePicture) {
                    profileAvatar.src = getDefaultAvatar(user.name);
                }

                alert('Perfil actualizado correctamente');

                // Clear password fields
                passwordInput.value = '';
                passwordConfirmInput.value = '';
            }
        } catch (error) {
            console.error(error);
            alert('Error al actualizar el perfil: ' + error.message);
        }
    });

    // Handle Logout
    const logoutBtn = document.getElementById('profile-logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
                window.location.reload(); // Reload to trigger auth check in index.html
            }
        });
    }
})();
