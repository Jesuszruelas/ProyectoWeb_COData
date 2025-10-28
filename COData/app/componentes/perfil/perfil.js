// Espera a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {

    // Selecciona el formulario de perfil
    const profileForm = document.querySelector(".profile-form");

    if (profileForm) {
        profileForm.addEventListener("submit", (event) => {
            // Previene el envío tradicional
            event.preventDefault(); 
            
            // Simulación de guardado
            const nombre = document.getElementById("profile-name").value;
            console.log(`Guardando cambios para: ${nombre}`);
            
            alert("¡Perfil actualizado exitosamente!");
        });
    }

    // Lógica para el botón "Cambiar Foto"
    const changePicBtn = document.querySelector(".btn-change-pic");
    const fileInput = document.getElementById("profile-pic-upload");
    
    if (changePicBtn && fileInput) {
        changePicBtn.addEventListener("click", (e) => {
            e.preventDefault(); // Previene envío de formulario si es type="submit"
            fileInput.click(); // Abre el selector de archivos
        });

        // Evento cuando el usuario selecciona un archivo
        fileInput.addEventListener("change", () => {
            if (fileInput.files && fileInput.files[0]) {
                const reader = new FileReader();
                
                reader.onload = (e) => {
                    // Muestra la nueva imagen en la previsualización
                    const profileImage = document.querySelector(".profile-pic-img");
                    profileImage.src = e.target.result;
                };
                
                // Lee el archivo como una URL de datos
                reader.readAsDataURL(fileInput.files[0]);
            }
        });
    }

    // Lógica para el botón "Cerrar Sesión"
    const logoutBtn = document.querySelector(".btn-logout");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            
            // Simulación de cierre de sesión
            alert("Cerrando sesión...");
            
            // Redirige al login (asumiendo que se llama login.html)
            // Asegúrate de tener un 'login.html' para que esto funcione
            // window.location.href = "login.html"; 
        });
    }
});

