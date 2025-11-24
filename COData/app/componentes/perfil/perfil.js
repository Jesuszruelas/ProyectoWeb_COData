document.addEventListener('DOMContentLoaded', () => {
    const avatarInput = document.getElementById('avatar-upload');
    const profileAvatar = document.querySelector('.profile-avatar');
    const fullNameInput = document.getElementById('full-name');
    const emailInput = document.getElementById('email');

    // Load user data
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        fullNameInput.value = user.name;
        emailInput.value = user.email;
        if (user.profilePicture) {
            profileAvatar.src = user.profilePicture;
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
});
