# ProyectoWeb_COData

*Integrantes:* Jesús Zamora, Bryan Palma, Isai Herrera, Ave Pineda.

## COData

COData es un Sistema de Gestión Municipal diseñado para optimizar la gestión de problemas locales, como solicitudes de mantenimiento público, a la vez que proporciona a los usuarios un fácil acceso al seguimiento de informes y actualizaciones de estado.

## Resumen del Proyecto

El proyecto COData proporciona una interfaz para que los usuarios reporten problemas municipales y realicen un seguimiento de su estado mediante una aplicación web moderna e intuitiva. Los usuarios pueden iniciar sesión para acceder a sus paneles personalizados, ver informes y consultar mapas con detalles de las tareas de mantenimiento en curso.

## Ejecución del Proyecto

Para ejecutar este proyecto localmente, siga estos pasos:

1.  **Requisitos Previos:** Asegúrese de tener instalado [Node.js](https://nodejs.org/) en su sistema.

2.  **Instalación de Dependencias:**
    Abra una terminal y navegue hasta la carpeta del servidor:
    ```bash
    cd COData/server
    npm install
    ```

3.  **Iniciar el Servidor:**
    Una vez instaladas las dependencias, inicie el servidor con el siguiente comando:
    ```bash
    npm start
    ```
    O si tiene `nodemon` instalado para desarrollo:
    ```bash
    npm run dev
    ```

4.  **Acceder a la Aplicación:**
    El servidor iniciará y servirá la aplicación frontend. Abra su navegador y vaya a:
    `http://localhost:3000`

## Uso

**Inicio de sesión:** Utilice las credenciales proporcionadas en la interfaz de usuario:

* **Usuario:** `usuario@cdata.com` / **Contraseña:** `user123`
* **Administrador:** `admin@cdata.com` / **Contraseña:** `admin123`

**Navegar por la aplicación:** Puede interactuar con diferentes secciones a través del menú lateral, como:

* Panel de Control
* Seguimiento
* Captura de Evidencia
* Notificaciones
* Perfil
* Mapas
* Cerrar sesión

## Características

* **Autenticación de usuario:** Los usuarios pueden iniciar sesión como usuario normal o administrador.
* **Gestión de perfiles:** Los usuarios pueden ver y gestionar sus perfiles.
* **Gestión de informes:** Los usuarios pueden enviar y hacer seguimiento de informes, incluyendo la adición de evidencia.
* **Mapa Interactivo:** Visualización de reportes en un mapa georreferenciado.
* **Sistema de Notificaciones:** Alertas en tiempo real sobre el estado de los reportes.
* **Seguimiento de Reportes:** Visualización detallada del estado y progreso de los reportes.
* **Captura de Evidencia:** Posibilidad de adjuntar fotos y videos a los reportes.
* **Panel de Control (Dashboard):** Vista general con estadísticas y accesos rápidos para usuarios y administradores.
