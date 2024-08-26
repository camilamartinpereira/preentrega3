Bo! Escuchate Esto - Gestor de Playlists
¡Bienvenido a Bo! Escuchate Esto, un gestor de playlists moderno, interactivo y conectado a Spotify! Este proyecto ha sido desarrollado como parte del curso de JavaScript en Coderhouse. La aplicación permite a los usuarios crear, gestionar y descubrir playlists de manera dinámica, todo dentro de una interfaz elegante y fácil de usar.

Descripción
Bo! Escuchate Esto es un sitio web que permite a los usuarios crear y gestionar playlists personalizadas. Además, ofrece recomendaciones de playlists basadas en la API de Spotify, facilitando la adición de nuevas canciones y el descubrimiento de música. El proyecto utiliza tecnologías modernas como HTML5, CSS3 (Tailwind CSS), JavaScript, SweetAlert2, y Tippy.js para ofrecer una experiencia de usuario fluida y atractiva.

Características
Creación de Playlists: Crea nuevas playlists mediante un proceso guiado que incluye la selección del nombre, género y la adición de canciones, ya sea manualmente o a través de recomendaciones.
Gestión de Playlists: Visualiza, edita y elimina playlists fácilmente. Agrega y elimina canciones según tu preferencia.
Recomendación de Playlists: Obtén recomendaciones de playlists directamente desde Spotify según el género seleccionado.
Búsqueda Dinámica: Busca playlists por nombre o género desde cualquier página. Las coincidencias se muestran en un popup que incluye opciones para editar la playlist.
Login Seguro: Sistema de autenticación utilizando credenciales almacenadas en un archivo JSON para proteger el acceso a la aplicación.
Tecnologías Utilizadas
HTML5: Estructura y contenido del sitio.
CSS3 (Tailwind CSS): Diseño responsivo y moderno.
JavaScript (ES6+): Lógica del sitio, gestión del DOM, interacciones dinámicas y conexión con la API de Spotify.
SweetAlert2: Notificaciones y alertas interactivas.
Tippy.js: Mejoras de UX mediante tooltips.
Spotify Web API: Integración para la búsqueda de canciones y recomendaciones.
Estructura del Proyecto
El proyecto sigue la siguiente estructura de archivos:

plaintext
Copiar código
/
├── data/
│   └── credentials.json
├── js/
│   ├── main.js
│   └── playlists.js
├── pages/
│   └── playlists.html
├── src/
│   ├── input.css
│   └── output.css
├── index.html
├── package-lock.json
├── package.json
└── tailwind.config.js
Instalación
Clona este repositorio en tu máquina local:

bash
Copiar código
git clone https://github.com/tuusuario/bo-escuchate-esto.git
Navega al directorio del proyecto:

bash
Copiar código
cd bo-escuchate-esto
Instala las dependencias:

bash
Copiar código
npm install
Ejecuta el proyecto en un servidor local:

bash
Copiar código
npm start
Uso
Abre el proyecto en tu navegador en http://127.0.0.1:5500.
Inicia sesión utilizando las credenciales predeterminadas (usuario: user, contraseña: 123456).
Explora las funcionalidades del gestor de playlists, crea nuevas playlists, y obtén recomendaciones directamente desde Spotify.
Contribuciones
Las contribuciones son bienvenidas. Si deseas mejorar el proyecto, por favor sigue estos pasos:

Haz un fork del repositorio.
Crea una nueva rama (git checkout -b feature/nueva-funcionalidad).
Realiza tus cambios y haz un commit (git commit -m 'Agrega nueva funcionalidad').
Empuja tus cambios (git push origin feature/nueva-funcionalidad).
Crea un pull request.
Créditos
Este proyecto fue desarrollado por [Tu Nombre] como parte del curso de JavaScript en Coderhouse. Agradecimientos especiales a los instructores y compañeros por su apoyo y feedback.
